// @flow

import { arrayIncludes, arrayEquals, arrayIntersection } from '../ArrayFun';

// 0 => correct
// 1 => wrong justification
// 2 => incorrect
export default (
  answers: Array<number>,
  respected: Array<number>,
  contradictories: Array<number>,
  suffisants: Array<any>
) =>
  containsNotRespected(answers, respected) &&
  containsContradictory(answers, contradictories);

export const containsNotRespected = (
  answers: Array<number>,
  respected: Array<number>
) => arrayEquals(arrayIntersection(answers, respected), answers);

export const containsContradictory = (
  answers: Array<number>,
  contradictories: Array<number>
) => arrayIntersection(answers, contradictories).length > 0;

export const containsOneSuffisantSet = (
  answers: Array<number>,
  suffisants: Array<any>
) =>
  suffisants.reduce(
    (acc, curr) =>
      acc ||
      (Array.isArray(curr) &&
        arrayEquals(arrayIntersection(answers, curr), curr)),
    false
  );

// constains no irrelevant (that aren't in a set of suffisants)
