// @flow

import {
  arrayEquals,
  arrayIntersection,
  arrayDifference,
  arrayMinus
} from '../ArrayFun';

// 0 => correct
// 1 => wrong justification
// 2 => incorrect
export default (
  isIncorrect: boolean,
  caseAnswer: number,
  answers: Array<number>,
  respected: Array<number>,
  contradictories: Array<number>,
  unnecessaries: Array<number>,
  suffisants: Array<any>
) => {
  const respectedRes = containsNotRespected(answers, respected); // should always be true
  const contradictoryRes = containsContradictory(answers, contradictories);
  const suffisantRes = containsOneSuffisantSet(answers, suffisants);
  const unnecessaryRes = containsNoUnnecessary(
    answers,
    unnecessaries,
    suffisants
  );
  const finalResult = {
    result: 0,
    caseAns: caseAnswer,
    reason: '',
    properties: []
  };
  switch (caseAnswer) {
    case 0: // choose answer true
      if (respectedRes.result) {
        finalResult.reason = 'NotRespected';
        finalResult.properties = respectedRes.properties;
      } else if (contradictoryRes.result) {
        finalResult.reason = 'Contradictory';
        finalResult.properties = contradictoryRes.properties;
      } else if (suffisantRes.result) {
        if (suffisantRes.properties === undefined)
          finalResult.reason = 'NoSuffisant';
        else finalResult.reason = 'NoCompleteSuffisant';
        finalResult.properties = suffisantRes.properties;
      } else if (!unnecessaryRes.result) {
        finalResult.reason = 'Unnecessary';
        finalResult.properties = unnecessaryRes.properties;
      }
      finalResult.result = isIncorrect ? 2 : finalResult.reason === '' ? 0 : 1;
      break;
    case 1: // choose answer false why incorrect
      if (respectedRes.result) {
        finalResult.reason = 'NotRespected';
        finalResult.properties = respectedRes.properties;
      } else if (!arrayEquals(contradictoryRes.properties, answers)) {
        finalResult.reason = 'NoContradictory';
        finalResult.properties = arrayMinus(answers, contradictories);
      }
      finalResult.result = !isIncorrect ? 2 : finalResult.reason === '' ? 0 : 1;
      break;
    case 2: // choose answer false what's missing
      if (!respectedRes.result) {
        finalResult.reason = 'Respected';
        finalResult.properties = arrayMinus(answers, respectedRes.properties);
      } else if (contradictoryRes.result) {
        finalResult.reason = 'Contradictory';
        finalResult.properties = contradictoryRes.properties;
      } else if (!unnecessaryRes.result) {
        finalResult.reason = 'Unnecessary';
        finalResult.properties = unnecessaryRes.properties;
      }
      finalResult.result = !isIncorrect ? 2 : finalResult.reason === '' ? 0 : 1;
      break;
    default:
  }
  return finalResult;
};

// containsNotRespected(answers, respected) &&
// containsContradictory(answers, contradictories);

export const containsNotRespected = (
  answers: Array<number>,
  respected: Array<number>
) => {
  if (!arrayEquals(arrayIntersection(answers, respected), answers))
    return {
      result: true,
      properties: arrayMinus(arrayDifference(answers, respected), respected)
    };
  return { result: false, properties: [] };
};

export const containsContradictory = (
  answers: Array<number>,
  contradictories: Array<number>
) => {
  if (arrayIntersection(answers, contradictories).length > 0)
    return {
      result: true,
      properties: arrayIntersection(answers, contradictories)
    };
  return { result: false, properties: [] };
};

// undefined if suffisants incorrect or answers has no element in flatten(suffisants)
export const containsOneSuffisantSet = (
  answers: Array<number>,
  suffisants: Array<any>
) => {
  const tmp = suffisants.reduce(
    (acc, curr) =>
      acc ||
      (Array.isArray(curr) &&
        arrayEquals(arrayIntersection(answers, curr), curr)),
    false
  );
  if (tmp) return { result: true, properties: [] };
  const tmp2 = suffisants.filter(
    x =>
      Array.isArray(x) &&
      arrayIntersection(answers, x).length > 0 &&
      !arrayEquals(arrayIntersection(answers, x), x)
  )[0];
  return { result: false, properties: tmp2 };
};

// constains no irrelevant (that aren't in a set of suffisants)
export const containsNoUnnecessary = (
  answers: Array<number>,
  unnecessaries: Array<number>,
  suffisants: Array<any>
) => {
  const tmp1 = arrayIntersection(answers, unnecessaries);
  const tmp2 = arrayIntersection(tmp1, [].concat(...suffisants)); // flatten suffisants
  if (arrayEquals(tmp1, tmp2)) return { result: true, properties: [] };
  return { result: false, properties: arrayMinus(tmp1, tmp2) };
};
