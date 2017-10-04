// @flow

export const arrayEqual = (a: Array<any>, b: Array<any>) =>
  a.reduce((acc, curr, i) => acc && b[i] === curr, a.length === b.length);
export const arrayInclude = (a: Array<any>, b: Array<any>) =>
  a.reduce((acc, curr) => acc || arrayEqual(curr, b), false);
export const stringToArray = (a: string) => a.split(',').map(y => Number(y));
