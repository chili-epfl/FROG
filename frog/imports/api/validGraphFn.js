// @flow
import { compact, flatMap } from 'lodash';
import { hideConditional } from 'frog-utils';

import { activityTypes, activityTypesObj } from '../activityTypes';
import { operatorTypes, operatorTypesObj } from '../operatorTypes';
import traceSocial from './traceSocial';
import checkSocial from './checkSocial';
import validateConfig from './validateConfig';

export const checkComponent = (
  obj: Array<any>,
  nodeType: 'activity' | 'operator',
  connections: any[]
) =>
  obj.reduce((acc: Object[], x: Object): Object[] => {
    const type = nodeType === 'activity' ? x.activityType : x.operatorType;
    if (type === undefined) {
      // only warning if operator that has not been connected
      const severity =
        nodeType === 'operator' &&
        !connections.find(
          conn => conn.target.id === x._id || conn.source.id === x._id
        )
          ? 'warning'
          : 'error';
      return [
        ...acc,
        {
          id: x._id,
          nodeType,
          err: 'Type is not defined',
          type: 'missingType',
          severity
        }
      ];
    }

    if (
      !activityTypes.map(y => y.id).includes(type) &&
      !operatorTypes.map(y => y.id).includes(type)
    ) {
      return [
        ...acc,
        {
          id: x._id,
          nodeType,
          err: `The ${nodeType}Package ${type} is not installed`,
          type: 'missingPackage',
          severity: 'error'
        }
      ];
    }

    return acc;
  }, []);

const checkConnection = (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) => [
  ...activities.reduce((acc: Object[], act: Object): Object[] => {
    if (act.plane === 2) {
      if (!act.groupingKey) {
        return [
          ...acc,
          {
            id: act._id,
            nodeType: 'activity',
            err: 'A group activity must have a grouping key',
            type: 'needsGroupingKey',
            severity: 'error'
          }
        ];
      }

      const connectedOperatorIds = connections
        .filter(x => x.target.id === act._id)
        .map(x => x.source.id);

      const hasSocial = operators
        .filter(x => connectedOperatorIds.includes(x._id))
        .find(x => x.type === 'social');

      if (!hasSocial) {
        return [
          ...acc,
          {
            id: act._id,
            nodeType: 'activity',
            err: 'A group activity needs to be connected to a social operator',
            type: 'needsSocialOp',
            severity: 'error'
          }
        ];
      }
    }

    return acc;
  }, []),
  ...operators.reduce((acc, op) => {
    if (!connections.find(x => x.source.id === op._id)) {
      return [
        ...acc,
        {
          id: op._id,
          nodeType: 'operator',
          err: `Does not have any outgoing connections`,
          type: 'noOutgoing',
          severity: 'warning'
        }
      ];
    }
    return acc;
  }, [])
];

const checkConfigs = (operators, activities) => {
  const operatorErrors = compact(
    flatMap(
      operators,
      x =>
        x.operatorType &&
        operatorTypesObj[x.operatorType] &&
        validateConfig(
          'operator',
          x._id,
          hideConditional(
            x.data,
            operatorTypesObj[x.operatorType].config,
            operatorTypesObj[x.operatorType].configUI
          ),
          operatorTypesObj[x.operatorType].config,
          operatorTypesObj[x.operatorType].validateConfig,
          operatorTypesObj[x.operatorType].configUI
        )
    )
  );
  const activityErrors = compact(
    flatMap(
      activities,
      x =>
        x.activityType &&
        activityTypesObj[x.activityType] &&
        validateConfig(
          'activity',
          x._id,
          hideConditional(
            x.data,
            activityTypesObj[x.activityType].config,
            activityTypesObj[x.activityType].configUI
          ),
          activityTypesObj[x.activityType].config,
          activityTypesObj[x.activityType].validateConfig
        )
    )
  );
  return compact([...operatorErrors, ...activityErrors]);
};

export default (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) => {
  const { social, socialErrors } = traceSocial(
    activities,
    operators,
    connections
  );
  const errors = checkComponent(activities, 'activity', connections)
    .concat(checkComponent(operators, 'operator', connections))
    .concat(checkConnection(activities, operators, connections))
    .concat(socialErrors)
    .concat(checkSocial(operators, activities, social))
    .concat(checkConfigs(operators, activities));

  return {
    errors,
    social
  };
};
