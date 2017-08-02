// @flow
import { activityTypes } from '../activityTypes';
import { operatorTypes } from '../operatorTypes';
import traceSocial from './traceSocial';

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
          err: 'Type of the ' + nodeType + ' ' + x.title + ' is not defined',
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
          err: `The ${nodeType}Package ${type} required by ${nodeType} ${x.title} is not installed`,
          type: 'missingPackage',
          severity: 'error'
        }
      ];
    }

    if (x.err) {
      return [
        ...acc,
        {
          id: x._id,
          err:
            'Error(s) in the configuration of the ' + nodeType + ' ' + x.title,
          type: 'configError',
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
            err:
              'The group activity ' +
              act.title +
              ' needs to be connected to a social operator',
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
          err: `The operator ${op.title} does not have any outgoing connections`,
          type: 'noOutgoing',
          severity: 'warning'
        }
      ];
    }
    return acc;
  }, [])
];

export default (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) => {
  const errors = checkComponent(activities, 'activity', connections)
    .concat(checkComponent(operators, 'operator', connections))
    .concat(checkConnection(activities, operators, connections));
  const social = traceSocial(activities, operators, connections);

  return {
    errors,
    social
  };
};
