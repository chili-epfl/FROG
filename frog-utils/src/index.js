// @flow
import React, { Component } from 'react';

import { compose, withHandlers, withState } from 'recompose';
import { shuffle, omit } from 'lodash';

export {
  default as EnhancedForm,
  hideConditional,
  calculateHides
} from './EnhancedForm';
export { generateReactiveFn, inMemoryReactive } from './generateReactiveFn';
export { Highlight } from './highlightSubstring';
export { msToString } from './msToString';
export { default as uuid } from 'cuid';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { default as ImageReload } from './ImageReload';
export {
  mergeSocialStructures,
  focusStudent,
  focusRole,
  getAttributeKeys,
  getAttributeValues
} from './socstructTools';
export {
  wrapUnitAll,
  extractUnit,
  getMergedExtractedUnit
} from './dataStructureTools';
export type {
  ActivityDbT,
  OperatorDbT,
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
  controlOperatorT,
  ControlStructureT,
  ControlT,
  ReactComponent
} from './types';
export { default as CountChart } from './DashboardComponents/CountChart';

export const A = ({ onClick, children, ...rest }: any): any => (
  <a
    href="#"
    onClick={e => {
      e.preventDefault();
      onClick();
    }}
    {...rest}
  >
    {children}
  </a>
);

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
    toggleVisibility: ({ setVisibility }) => () => setVisibility(n => !n)
  })
);

export const flattenOne = (ary: any[]): any[] =>
  ary.reduce(
    (acc: any[], x: any) => (Array.isArray(x) ? [...acc, ...x] : [...acc, x]),
    []
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

const groupchars = 'ABCDEFGHIJKLMNOPQRSTUWXYZ123456789'.split('');
export const getSlug = (n: number) =>
  shuffle(groupchars)
    .slice(0, n)
    .join('');

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  type: 'textarea' | 'textinput'
};

export class ReactiveText extends Component {
  textRef: any;
  binding: any;
  state: ReactivePropsT;

  update = (props: ReactivePropsT) => {
    this.setState({ path: props.path, dataFn: props.dataFn });
    if (this.binding) {
      this.binding.destroy();
    }
    this.binding = props.dataFn.bindTextField(this.textRef, props.path);
  };

  componentDidMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps: ReactivePropsT) {
    if (
      (nextProps.dataFn && nextProps.dataFn.doc.id) !==
        (this.props.dataFn && this.props.dataFn.doc.id) ||
      this.props.path !== nextProps.path ||
      this.props.type !== nextProps.type
    ) {
      this.update(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.binding) {
      this.binding.destroy();
    }
  }

  render() {
    const rest = omit(this.props, ['path', 'dataFn']);
    return this.props.type === 'textarea' ? (
      <textarea ref={ref => (this.textRef = ref)} {...rest} defaultValue="" />
    ) : (
      <input
        type="text"
        ref={ref => (this.textRef = ref)}
        {...rest}
        defaultValue=""
      />
    );
  }
}

// If you try to insert value=0 path=['a', 'b', 'c']
// into sharedb with doc={ 'a': { d:5 } }
// an error occur because doc['a']['b'] is undefined.
// This function cleans the query by changing it to
// path=['a'] value={ b: { c: 0 } }
// (see ./__tests__/index.js for more details)
export const splitPathObject = (obj: Object, path: string[], value: any) => {
  const { insertPath, leftoverPath } = path.reduce(
    (acc, val) =>
      acc.obj
        ? { ...acc, obj: acc.obj[val], insertPath: [...acc.insertPath, val] }
        : { ...acc, leftoverPath: [val, ...acc.leftoverPath] },
    { obj, insertPath: [], leftoverPath: [] }
  );

  let insertObject = value;
  leftoverPath.forEach(val => {
    insertObject = { [val]: insertObject };
  });

  return { insertPath, insertObject };
};
