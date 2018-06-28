// @flow
import { flatMap, filter, includes, uniq } from 'lodash';
import { operatorTypesObj } from '../operatorTypes';
import { type SocialT, type ErrorListT } from './validGraphFn';

export const getOperator = (operator: any) => {
  const optype = operatorTypesObj[operator.operatorType];
  const spec =
    optype && optype.type === 'social' && optype.socialOutputDefinition;
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
): { socialErrors: ErrorListT, social: SocialT } => {
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
    const socAttribs = flatMap(sources, y => {
      const attribs = getOperator(socOperators.find(op => op._id === y));
      attribs.forEach(item => {
        if (item.includes('.')) {
          errors.push({
            id: y,
            nodeType: 'operator',
            type: 'socialAttributeWithPeriod',
            severity: 'error',
            err: `The name of social attribute "${item}" contains a period, which is not allowed.`
          });
        }
      });
      return attribs;
    });
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
