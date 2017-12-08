// @flow
import { activityTypesObj } from '../activityTypes';
import { operatorTypesObj } from '../operatorTypes';

export default (
  activities: any[],
  operators: any[],
  social: { [string]: string[] }
) => {
  const errors = [];
  [...activities, ...operators].forEach(node => {
    const soc = social[node._id] || [];
    const nodeType = node.plane ? 'activity' : 'operator';
    const nodePackage =
      nodeType === 'activity'
        ? activityTypesObj[node.activityType]
        : operatorTypesObj[node.operatorType];
    if (nodePackage && node.data) {
      const socialFields =
        (nodePackage.config &&
          nodePackage.config.properties &&
          Object.keys(nodePackage.config.properties).filter(
            x => nodePackage.config.properties[x].type === 'socialAttribute'
          )) ||
        [];

      const socialFieldValues = socialFields.reduce((acc, x) => {
        if (typeof node.data[x] === 'string' && node.data[x].length > 0) {
          if (!social[node._id] || !social[node._id].includes(node.data[x])) {
            errors.push({
              id: node._id,
              nodeType,
              err: `Config requires the social attribute '${
                x
              }', which is not provided by any connected social operator`,
              type: 'missingSocialAttribute',
              severity: 'error'
            });
          } else {
            return [...acc, node.data[x]];
          }
        }
        return acc;
      }, []);
      if (node.groupingKey && node.groupingKey.length > 0) {
        // should not be able to happen, but just in case
        if (socialFieldValues.includes(node.groupingKey)) {
          errors.push({
            id: node._id,
            nodeType,
            err: `Cannot use the same social attribute in the grouping field, and in the configuration`,
            type: 'groupingKeyInConfig',
            severity: 'error'
          });
        }
      }
    }
    if (node.groupingKey && node.groupingKey.length > 0 && node.plane === 2) {
      if (!soc.includes(node.groupingKey)) {
        errors.push({
          id: node._id,
          nodeType,
          err: `Requires the grouping attribute '${
            node.groupingKey
          }', which is not provided by any connected social operator`,
          type: 'groupingKeyNotProvided',
          severity: 'error'
        });
      }
    }
  });
  return errors;
};
