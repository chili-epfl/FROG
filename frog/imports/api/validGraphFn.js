// @flow
import { activityTypes } from '../activityTypes';
import { operatorTypes } from '../operatorTypes';

export const checkComponent = (
  obj: Array<any>,
  nodeType: 'activity' | 'operator'
) =>
  obj.reduce((acc, x) => {
    const type = nodeType === 'activity' ? x.activityType : x.operatorType;
    if (type === undefined) {
      return [
        ...acc,
        {
          id: x._id,
          err: 'Type of the ' + nodeType + ' ' + x.title + ' is not defined'
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
          err: `The ${nodeType}Package ${type} required by ${nodeType} ${x.title} is not installed`
        }
      ];
    }

    if (x.err) {
      return [
        ...acc,
        {
          id: x._id,
          err:
            'Error(s) in the configuration of the ' + nodeType + ' ' + x.title
        }
      ];
    }
    return acc;
  }, []);

const checkConnection = (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) =>
  activities.reduce((acc, act) => {
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
              ' needs to be connected to a social operator'
          }
        ];
      }
    }

    return acc;
  }, []);

const checkAll = (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) =>
  checkComponent(activities, 'activity')
    .concat(checkComponent(operators, 'operator'))
    .concat(checkConnection(activities, operators, connections));

export default checkAll;
