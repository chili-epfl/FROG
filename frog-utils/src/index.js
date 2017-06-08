// @flow
import React from 'react';

import { compose, withHandlers, withState } from 'recompose';
export { default as uuid } from 'cuid';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { focusStudent, focusRole } from './socstructTools';
export type {
  ActivityPackageT,
  ActivityRunnerT,
  SocialStructureT,
  ProductT,
  ObjectT,
  OperatorPackageT
} from './types';

export const A = ({ onClick, children, ...rest }: any): any =>
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
    {...rest}
  >
    {children}
  </a>;

export const currentDate = (): string => {
  const d = new Date();
  return d.toString();
};

export const booleanize = (bool: string): boolean => bool === 'true';

export const shorten = (text: string, length: number): string => {
  const t = text || '';
  if (t.length < length) {
    return t;
  }
  return `${t.slice(0, length - 3)}...`;
};

// checks that some of the values in an object are not empty
export const notEmpty = (obj: Object): boolean => {
  if (!obj) {
    return false;
  }
  return Object.keys(obj).reduce((acc, val) => acc || Boolean(obj[val]), false);
};

// list utils
export const splitAt = (i: number, xs: Array<any>): Array<Array<any>> => {
  const first = xs.slice(0, i);
  const second = xs.slice(i, xs.length);
  return [first, second];
};

export const zipList = (xs: Array<any>): Array<any> =>
  xs[0].map((_, i) => xs.map(x => x[i]));

export const promiseTimeout = (ms, promise) => {
  // Create a promise that rejects in <ms> milliseconds
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject('Timed out in ' + ms + 'ms.');
    }, ms);
  });

  // Returns a race between our timeout and the passed in promise
  return Promise.race([promise, timeout]);
};

export const withVisibility = compose(
  withState('visible', 'setVisibility', false),
  withHandlers({
    toggleVisibility: ({ setVisibility }) => () => setVisibility(n => !n)
  })
);
