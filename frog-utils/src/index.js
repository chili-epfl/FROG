// @flow

export { default as colorRange } from './color_range'
export { default as Chat } from './chat'
export { default as unrollProducts } from './unroll_products'
export { default as TimedComponent } from './TimedComponent'
export type { 
  ActivityPackageT,
  ActivityRunnerT,
  SocialStructureT,
  ProductT,
  ObjectT,
  OperatorPackageT
} from './types'

export { default as uuid } from 'cuid'

export const currentDate = (): string => {
  const d = new Date()
  return d.toString()
}

export const booleanize = (bool: string): boolean => (bool === 'true')

export const shorten = (text: string, length: number): string => {
  const t = text || ''
  if (t.length < length) {
    return t
  }
  return `${t.slice(0, length - 3)}...`
}

// checks that some of the values in an object are not empty
export const notEmpty = (obj: Object): boolean => {
  if (!obj) { return false }
  return Object.keys(obj).reduce(
    (acc, val) => acc || Boolean(obj[val]), false)
}

export const identity = <T>(e: T): T => e

// list utils
export const splitAt = (i: number, xs: Array<any>): Array<Array<any>> => {
  const first = xs.slice(0, i);
  const second = xs.slice(i, xs.length);
  return [first, second];
}

export const shuffleList = (xs: Array<any>): Array<any> =>
  xs.slice(0).sort(() => 0.5 - Math.random())

export const zipList = (xs: Array<any>): Array<any> =>
  xs[0].map((_, i) => xs.map((x) => x[i]))
