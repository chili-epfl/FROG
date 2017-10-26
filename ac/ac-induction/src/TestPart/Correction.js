// @flow

import {
  arrayEquals,
  arrayIntersection,
  arrayDifference,
  arrayMinus
} from '../ArrayFun';
// results codes:
// 0 => correct
// 1 => wrong justification
// 2 => incorrect

// show codes:
// 0 => nothing
// 1 => corrects & contains
// 2 => corrects & doesn't contains
// 3 => incorrects & contains
export default (
  isIncorrect: boolean,
  caseAnswer: number,
  answers: Array<number>,
  respected: Array<number>,
  contradictories: Array<number>,
  unnecessaries: Array<number>,
  suffisants: Array<any>
) => {
  const respectedRes = containsNotRespected(answers, respected); // should always be false
  const contradictoryRes = containsContradictory(answers, contradictories);
  const suffisantRes = containsOneSuffisantSet(answers, suffisants);
  const unnecessaryRes = containsNoUnnecessary(
    answers,
    unnecessaries,
    suffisants
  );
  const finalResult = {
    result: 0,
    show: 0,
    propertiesIndex: []
  };
  switch (caseAnswer) {
    case 0: // choose answer true
      finalResult.result = isIncorrect ? 2 : 1;
      finalResult.show = 3;
      if (respectedRes.result) {
        finalResult.propertiesIndex = respectedRes.properties; // incorrects & contains
      } else if (answers.length === 0) {
        finalResult.show = 0;
      } else if (contradictoryRes.result) {
        finalResult.propertiesIndex = answers; // incorrects & contains
      } else if (!suffisantRes.result) {
        finalResult.propertiesIndex = suffisantRes.properties; // incorrects & contains
      } else if (!unnecessaryRes.result) {
        finalResult.show = 2;
        finalResult.propertiesIndex = arrayMinus(
          answers,
          unnecessaryRes.properties
        ); // correct & doesn't contains
      } else {
        finalResult.result = 0;
        finalResult.show = 0;
      }
      break;
    case 1: // choose answer false why incorrect
      finalResult.result = !isIncorrect ? 2 : 1;
      finalResult.show = 1;
      if (respectedRes.result) {
        finalResult.propertiesIndex = respectedRes.properties; // ? & contains
      } else if (answers.length === 0) {
        finalResult.show = 0;
      } else if (arrayMinus(answers, contradictoryRes.properties).length > 0) {
        finalResult.propertiesIndex = arrayMinus(answers, contradictories); // corrects & contains
      } else {
        finalResult.result = 0;
        finalResult.show = 0;
      }
      break;
    case 2: // choose answer false what's missing
      finalResult.result = !isIncorrect ? 2 : 1;
      finalResult.show = 2;
      if (!respectedRes.result && answers.length > 0) {
        finalResult.show = 3;
        finalResult.propertiesIndex = arrayMinus(
          answers,
          respectedRes.properties
        ); // ? & contains
      } else if (contradictoryRes.result || answers.length === 0) {
        finalResult.propertiesIndex = contradictoryRes.properties; // corrects & doesn't contains
      } else if (!unnecessaryRes.result) {
        finalResult.propertiesIndex = unnecessaryRes.properties; // corrects & doesn't contains
      } else if (
        isIncorrect &&
        !containsOneSuffisantSet(respected.concat(answers), suffisants).result
      ) {
        finalResult.show = 3;
        finalResult.propertiesIndex = answers; // What to put here ???     (incorrects & contains)
      } else if (!isIncorrect || answers.length === 0) finalResult.show = 0;
      else {
        finalResult.result = 0;
        finalResult.show = 0;
      }
      break;
    default:
  }
  return finalResult;
};

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
  // const tmp2 = suffisants.filter(
  //   x =>
  //     Array.isArray(x) &&
  //     arrayIntersection(answers, x).length > 0 &&
  //     !arrayEquals(arrayIntersection(answers, x), x)
  // )[0];
  return { result: false, properties: answers };
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
