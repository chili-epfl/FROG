// @flow
/* eslint-disable react/no-array-index-key */

import * as React from 'react';
import { compose, withHandlers, withState } from 'recompose';
import { shuffle, isString, filter, split, isEqual } from 'lodash';
import ReactLoadable from 'react-loadable';

export const Loadable = ({
  loader,
  componentDescription
}: {
  loader: void => Promise<*>,
  componentDescription: string
}) =>
  ReactLoadable({
    loader,
    loading(props) {
      if (props.error) {
        console.error(props.error);
        return <div>React Loader error! {componentDescription}</div>;
      } else if (props.timedOut) {
        return <div>React Loader Timed Out! {componentDescription}</div>;
      } else {
        return null;
      }
    },
    timeout: 10000
  });

export const isBrowser = (() => {
  try {
    return !!window;
  } catch (e) {
    return false;
  }
})();

export const ReactJsonView = isBrowser
  ? require('react-json-view').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export const EnhancedForm = isBrowser
  ? require('./EnhancedForm.js').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export const ReactiveRichText = isBrowser
  ? require('./ReactiveRichText/main').default // eslint-disable-line global-require
  : () => <p>Node</p>; // React component to make Flow happy, will never be shown

export {
  hideConditional,
  calculateHides,
  calculateSchema,
  defaultConfig
} from './enhancedFormUtils';
export { MemDoc, pureObjectReactive } from './generateReactiveMem';
export { Highlight } from './highlightSubstring';
export { default as HTML } from './renderHTML';
export { unicodeLetter, notUnicodeLetter } from './unicodeRegexpEscapes';
export { ReactiveText } from './ReactiveText';
export { msToString } from './msToString';
export { default as uuid } from 'cuid';
export { default as SearchField } from './SearchField';
export { default as colorRange } from './colorRange';
export { default as unrollProducts } from './unrollProducts';
export { default as TimedComponent } from './TimedComponent';
export { TextInput, ChangeableText } from './TextInput';
export { default as ImageReload } from './ImageReload';
export { default as cleanEmptyCols } from './cleanEmptyCols';
export { default as strfTime } from './strfTime';
export { default as chainUpgrades } from './chainUpgrades';
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
  DashboardDataDbT,
  MongoT,
  CursorT,
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
  ActivityRunnerPropsT,
  ActivityPackageT,
  productOperatorT,
  socialOperatorT,
  operatorPackageT,
  controlOperatorT,
  ControlStructureT,
  controlOperatorRunnerT,
  socialOperatorRunnerT,
  productOperatorRunnerT,
  ControlT,
  LogT,
  LogDbT,
  DashboardT,
  DashboardViewerPropsT,
  LIComponentPropsT,
  LIRenderT,
  LearningItemComponentT,
  LearningItemT
} from './types';
export { CountChart } from './DashboardComponents/CountChart';

export { default as withDragDropContext } from './withDragDropContext';

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

// max replace 5 times, to avoid searching for a, and getting hundreds of replacements that need
// to be highlighted
export const highlightSearchHTML = (haystack: string, needle: string) => {
  if (!needle) {
    return haystack;
  }
  let c = 0;
  return haystack.replace(new RegExp(needle, 'gi'), str => {
    c += 1;
    return c > 5
      ? str
      : `<span style="background-color: #FFFF00">${str}</span>`;
  });
};

export const HighlightSearchText = ({
  haystack,
  needle,
  shorten
}: {
  haystack: string,
  needle?: string,
  shorten?: boolean
}) => {
  let result = haystack;
  if (shorten) {
    const contents = result
      .trim()
      .replace(/\n+/g, '\n')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/[^\S\r\n]\n/g, '\n');

    let i = 0;
    let line = 0;
    let c = 0;
    let acc = '';
    while (true) {
      const char = contents[i];
      if (!char) {
        break;
      }
      if (char === '\n') {
        c += 40 - Math.min(line, 40);
        line = 0;
      } else {
        c += 1;
        line += 1;
      }
      if (c > 500) {
        acc += '...';
        break;
      }
      acc += char;
      i += 1;
    }
    result = acc;
  }

  if (!needle) {
    return (
      <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>{result}</div>
    );
  }
  const parts = result.split(new RegExp(`(${needle})`, 'gi'));
  return (
    <div style={{ textAlign: 'left', whiteSpace: 'pre-wrap' }}>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === needle.toLowerCase()
              ? {
                  backgroundColor: '#FFFF00'
                }
              : {}
          }
        >
          {part}
        </span>
      ))}
    </div>
  );
};

export const highlightTargetRichText = (content: Object, target: string) => {
  const processedOps = [];
  content.ops.forEach(op => {
    if (isString(op.insert)) {
      const pieces = split(op.insert, new RegExp(target, 'i'));

      if (pieces.length > 1) {
        let targetIdxPtr = 0;
        pieces.forEach((piece, index) => {
          processedOps.push({ ...op, insert: piece });
          targetIdxPtr += piece.length;

          if (index !== pieces.length - 1) {
            processedOps.push({
              insert: op.insert.substring(
                targetIdxPtr,
                targetIdxPtr + target.length
              ),
              attributes: Object.assign({}, op.attributes, {
                background: '#ffff00'
              })
            });
            targetIdxPtr += target.length;
          }
        });
        return;
      }
    }
    processedOps.push(op);
  });
  return { ops: processedOps };
};

export const booleanize = (bool: string): boolean => bool === 'true';

export const shorten = (text: string, length: number): string => {
  const t = text || '';
  if (t.length < length) {
    return t;
  }
  return `${t.slice(0, length - 3)}...`;
};

export const shortenRichText = (
  dataRaw: { ops: Object[] },
  length: number
): Object => {
  const data = cloneDeep(dataRaw);
  // $FlowFixMe somehow it thinks cloneDeep always returns an array
  const ops = filter(data.ops, op => isString(op.insert));
  let contentLength = 0;
  let cutOffIndex = -1;
  let cutOffLength = 0;

  ops.forEach((op, index) => {
    delete op.attributes;
    op.insert = op.insert
      .trim()
      .replace(/\n+/g, '\n')
      .replace(/[^\S\r\n]+/g, ' ')
      .replace(/[^\S\r\n]\n/g, '\n');

    contentLength += op.insert.length;

    if (cutOffIndex < 0 && contentLength > length - 3) {
      cutOffIndex = index;
      cutOffLength = contentLength - (length - 3);
    }
  });

  if (contentLength <= length) {
    return { ops };
  } else {
    const trimmedOps = ops.slice(0, cutOffIndex);

    const edgeOp = ops[cutOffIndex];
    edgeOp.insert = edgeOp.insert.slice(0, edgeOp.insert.length - cutOffLength);
    trimmedOps.push(edgeOp);

    trimmedOps.push({ insert: '...' });
    return { ops: trimmedOps };
  }
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

export const withVisibility: Function = compose(
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

export const cloneDeep = (o: any): any => {
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

export const isEqualLI = (li1: Object, li2: Object): boolean =>
  typeof li1.li === 'string' ? li1.li === li2.li : isEqual(li1.li, li2.li);

export const Inspector = ({ data }: { data: Object | Object[] }) =>
  data ? (
    <ReactJsonView
      name={false}
      style={{ fontSize: '1.2em' }}
      src={data}
      iconStyle="triangle"
      enableClipboard={false}
      displayObjectSize={false}
      displayDataTypes={false}
      theme={{
        base00: '#fafafa',
        base01: '#f0f0f1',
        base02: '#e5e5e6',
        base03: '#a0a1a7',
        base04: '#696c77',
        base05: '#383a42',
        base06: '#202227',
        base07: '#090a0b',
        base08: '#ca1243',
        base09: '#d75f00',
        base0A: '#c18401',
        base0B: '#50a14f',
        base0C: '#0184bc',
        base0D: '#4078f2',
        base0E: '#a626a4',
        base0F: '#986801'
      }}
    />
  ) : null;

export const entries = <T>(obj: { [string]: T }): Array<[string, T]> => {
  const keys: string[] = Object.keys(obj);
  return keys.map(key => [key, obj[key]]);
};

export const values = <T>(obj: { [string]: T }): Array<T> => {
  const keys: string[] = Object.keys(obj);
  return keys.map(key => obj[key]);
};

export const getRotateable = (ary: *, toRotate: number): * =>
  new Proxy(ary, {
    get: (obj, prop) => obj[(parseInt(prop, 10) + toRotate) % obj.length]
  });

export const WikiContext = React.createContext([]);

export const EmbedlyCache = {};

export const getEmbedlyCache = (item: string) =>
  new Promise(resolve => {
    if (EmbedlyCache[item]) {
      console.log('in cache');
      resolve(EmbedlyCache[item]);
    }
    fetch('//noembed.com/embed?url=' + item.replace(/(<([^>]+)>)/gi, ''))
      .then(x => x.json())
      .then(x => {
        EmbedlyCache[item] = x.html;
        resolve(x.html);
      });
  });
