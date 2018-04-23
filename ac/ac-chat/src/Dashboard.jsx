// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
import { isEmpty } from 'lodash';
import { type LogDbT, type DashboardT } from 'frog-utils';

const fontSizeMapper = (itMax, word) => 10 + word.value * 150 / Number(itMax);

const Viewer = ({ state }: Object) => (
  <div style={{ width: '600px', height: '600px', margin: 'auto' }}>
    <WordCloud
      data={state.data}
      fontSizeMapper={word => fontSizeMapper(state.iMax, word)}
      width="600"
      height="600"
    />
  </div>
);

Viewer.displayName = 'Viewer';

const prepareDataForDisplay = (state: Object) => {
  const iMax = Object.values(state).reduce(
    (acc, curr) => Math.max(Number(acc), Number(curr)),
    1
  );
  const data = [...Object.keys(state).map(w => ({ text: w, value: state[w] }))];
  return { iMax, data };
};

const mergeLog = (state: Object, log: LogDbT) => {
  const tmp = log && log.value;
  if (tmp && typeof tmp === 'string')
    tmp
      .split(/[ :;?_().!,]/)
      .map(x => x.trim())
      .filter(x => !isEmpty(x))
      .map(x => x.toLowerCase())
      .forEach(word => (state[word] ? (state[word] += 1) : (state[word] = 1)));
};

const initData = {};

const wordcloud: DashboardT = {
  Viewer,
  mergeLog,
  initData,
  prepareDataForDisplay
};

export default { wordcloud };
