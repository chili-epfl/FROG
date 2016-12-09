// @flow

export { default as color_range } from './color_range'
export { default as Chat } from './chat'
export { default as unrollProducts } from './unroll_products'
export { default as TimedComponent } from './TimedComponent'
export type { ActivityPackageT, ActivityRunnerT } from './types'

export const uuid = () =>
// $FlowFixMe
  ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,a=>(a^Math.random()*16>>a/4).toString(16))

export const currentDate = (): string => {
  let d = new Date()
  return d.toString()
}

export const booleanize = (bool: string): boolean => (bool == 'true') ? true : false

export const shorten = (text: string, length: number): string => {
  let t = text || ''
  if (t.length < length) {
    return t
  } else {
    return t.slice(0, length-3)+'...'
  }
}

// checks that some of the values in an object are not empty
export const notEmpty = (obj: Object): boolean => {
  if(!obj) { return false }
  return Object.keys(obj).reduce(
    (acc, val) => acc || Boolean(obj[val]), false)
}

export const identity = (e: any): any => e

// list utils
export const splitAt = function(i: number, xs: Array<any>): Array<Array<any>> {
  var a = xs.slice(0, i);
  var b = xs.slice(i, xs.length);
  return [a, b];
};

export const shuffleList = function(xs: Array<any>): Array<any> {
  return xs.slice(0).sort(function() {
    return .5 - Math.random();
  });
};

export const zipList = function(xs: Array<any>): Array<any> {
  return xs[0].map(function(_,i) {
    return xs.map(function(x) {
      return x[i];
    });
  });
}
