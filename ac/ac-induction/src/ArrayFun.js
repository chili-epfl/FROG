// @flow

export const arrayEquals = (a: Array<any>, b: Array<any>) =>
  a.reduce((acc, curr, i) => acc && b[i] === curr, a.length === b.length);
export const arrayIncludes = (a: Array<any>, b: Array<any>) =>
  a.reduce((acc, curr) => acc || arrayEquals(curr, b), false);
export const stringToArray = (a: string) => a.split(',').map(y => Number(y));

export const arrayDifference = (a: Array<any>, b: Array<any>) =>
  a
    .filter(x => !arrayIncludes(b, x))
    .concat(b.filter(x => !arrayIncludes(a, x)));
export const arrayIntersection = (a: Array<any>, b: Array<any>) =>
  a.filter(x => b.includes(x));
