// @flow
import { flatMap, filter, includes, uniq } from 'lodash';
import { operatorTypesObj } from '../operatorTypes';

export const getOperator = (operator: any) => {
  const optype = operatorTypesObj[operator.operatorType];
  const spec = optype && optype.type === 'social' && optype.outputDefinition;
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

export const duplicates = (array: any[]): any[] =>
  uniq(
    filter(array, (value, index, iteratee) =>
      includes(iteratee, value, index + 1)
    )
  );

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

  const errors = [];
  const social = [...operators, ...activities].reduce((acc, x) => {
    const sources = socConnections
      .filter(con => con.target.id === x._id)
      .map(y => y.source.id);
    const socAttribs = flatMap(sources, y =>
      getOperator(socOperators.find(op => op._id === y))
    );
    if (socAttribs.length > 0) {
      const dup = duplicates(socAttribs);
      if (dup.length > 0) {
        const nodeType = x.plane ? 'activity' : 'operator';
        errors.push({
          id: x._id,
          nodeType,
          err: `Receives the social attribute(s) ${dup
            .map(y => `'${y}'`)
            .join(', ')} from more than one social operator.`,
          type: 'overlappingSocialAttributes',
          severity: 'error'
        });
      }

      return {
        ...acc,
        [x._id]: uniq(socAttribs)
      };
    } else {
      return acc;
    }
  }, {});
  return { socialErrors: errors, social };
};
