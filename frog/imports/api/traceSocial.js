// @flow

import { operatorTypesObj } from '../operatorTypes';
import { flatMap } from 'lodash';

export const getOperator = (operator: any) => {
  const spec =
    operatorTypesObj[operator.operatorType] &&
    operatorTypesObj[operator.operatorType].outputDefinition;
  if (spec) {
    if (Array.isArray(spec)) {
      return spec;
    } else {
      try {
        return spec(operator.data);
      } catch (e) {
        return [];
      }
    }
  } else {
    return [];
  }
};

export default (
  activities: Array<any>,
  operators: Array<any>,
  connections: Array<any>
) => {
  const socOperators = operators.filter(op => op.type === 'social');
  const socOperatorIds = socOperators.map(x => x._id);
  const socConnections = connections.filter(con =>
    socOperatorIds.includes(con.source.id)
  );

  return activities.reduce((acc, x) => {
    const sources = socConnections
      .filter(con => con.target.id === x._id)
      .map(x => x.source.id);
    const socAttribs = flatMap(sources, x =>
      getOperator(socOperators.find(op => op._id === x))
    );
    if (socAttribs.length > 0) {
      return {
        ...acc,
        [x._id]: socAttribs
      };
    } else {
      return acc;
    }
  }, {});
};
