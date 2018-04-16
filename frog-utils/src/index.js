// @flow
import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { shuffle } from 'lodash';
import ReactJsonView from 'react-json-view';

export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const EnhancedForm = isBrowser
  ? require('./EnhancedForm.js').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export {
  hideConditional,
  calculateHides,
  calculateSchema,
  defaultConfig
} from './enhancedFormUtils';
export { generateReactiveFn, inMemoryReactive } from './generateReactiveFn';
export { MemDoc, pureObjectReactive } from './generateReactiveMem';
export { Highlight } from './highlightSubstring';
export { default as HTML } from './renderHTML';
export { ReactiveText } from './ReactiveText';
export { msToString } from './msToString';
export { default as uuid } from 'cuid';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { default as ImageReload } from './ImageReload';
export { default as cleanEmptyCols } from './cleanEmptyCols';
export { default as strfTime } from './strfTime';
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
  GlobalStructureT,
  ActivityRunnerT,
  ActivityPackageT,
  productOperatorT,
  socialOperatorT,
  operatorPackageT,
  controlOperatorT,
  ControlStructureT,
  ControlT,
  ReactComponent,
  LogT,
  LogDBT,
  dashboardT,
  dashboardViewerPropsT
} from './types';
export { CountChart } from './DashboardComponents/CountChart';
export {
  default as TableView,
  toTableData
} from './ActivityComponents/TableView';
export { default as TreeView } from './ActivityComponents/TreeView';
// Exports for Dashboards
export { default as ProgressDashboard } from './dashboards/progress';
export { default as LeaderBoard } from './dashboards/leaderboard';
export { default as CoordinatesDashboard } from './dashboards/coordinates';

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
    toggleVisibility: ({ setVisibility }) => x => {
      if (typeof x === 'boolean') {
        setVisibility(x);
      } else {
        setVisibility(n => !n);
      }
    }
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

export const getDisplayName = (WrappedComponent: any): string => {
  if (typeof WrappedComponent.displayName === 'string') {
    return WrappedComponent.displayName;
  } else if (typeof WrappedComponent.name === 'string') {
    return WrappedComponent.name;
  } else {
    return 'Component';
  }
};

export const getInitialState = (activities: Object, d: number = 1) => {
  const n = Math.floor(activities.length / 2);
  return n === 0
    ? activities[0]
    : {
        direction: d > 0 ? 'row' : 'column',
        first: getInitialState(activities.slice(0, n), -d),
        second: getInitialState(activities.slice(n, activities.length), -d)
      };
};

export const cloneDeep = (o: any) => {
  let newO;
  let i;

  if (typeof o !== 'object') return o;

  if (!o) return o;
  if (o instanceof Date) return new Date(o.valueOf());
  if (Object.prototype.toString.apply(o) === '[object Array]') {
    newO = [];
    for (i = 0; i < o.length; i += 1) {
      newO[i] = cloneDeep(o[i]);
    }
    return newO;
  }

  newO = {};
  // eslint-disable-next-line no-restricted-syntax
  for (i in o) {
    if (Object.prototype.hasOwnProperty.call(o, i)) {
      newO[i] = cloneDeep(o[i]);
    }
  }
  return newO;
};

export const Inspector = ({ data }: { data: Object }) => (
  <ReactJsonView
    src={data}
    iconStyle="triangle"
    enableClipboard={false}
    displayObjectSize={false}
    displayDataTypes={false}
    theme="shapeshifter:inverted"
  />
);
