// @flow
import React from 'react';

import { compose, withHandlers, withState } from 'recompose';

export { default as EnhancedForm, hideConditional } from './EnhancedForm';
export { generateReactiveFn, inMemoryReactive } from './generateReactiveFn';
export { Highlight } from './highlightSubstring';
export { default as uuid } from 'cuid';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { default as dataURItoFile } from './URLtoFile';
export {
  mergeSocialStructures,
  focusStudent,
  focusRole,
  getAttributeKeys,
  getAttributeValues,
} from './socstructTools';
export {
  wrapUnitAll,
  extractUnit,
  getMergedExtractedUnit,
} from './dataStructureTools';
export type {
  ActivityDbT,
  studentStructureT,
  socialStructureT,
  dataUnitT,
  dataUnitStructT,
  structureDefT,
  payloadT,
  activityDataT,
  ObjectT,
  ActivityRunnerT,
  ActivityPackageT,
  productOperatorT,
  socialOperatorT,
  operatorPackageT,
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

export const withVisibility = compose(
  withState('visible', 'setVisibility', false),
  withHandlers({
    toggleVisibility: ({ setVisibility }) => () => setVisibility(n => !n),
  }),
);

export const flattenOne = (ary: any[]): any[] =>
  ary.reduce(
    (acc: any[], x: any) => (Array.isArray(x) ? [...acc, ...x] : [...acc, x]),
    [],
  );

export const wordWrap = (text: string, maxLength: number): string[] => {
  const result = [];
  let line = [];
  let length = 0;
  text.split(' ').forEach(word => {
    if (length + word.length >= maxLength) {
      result.push(line.join(' '));
      line = [];
      length = 0;
    }
    length += word.length + 1;
    line.push(word);
  });
  if (line.length > 0) {
    result.push(line.join(' '));
  }
  return result;
};
