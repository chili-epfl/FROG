// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
import { isEmpty } from 'lodash';

const fontSizeMapper = (itMax, word) => 10 + word.value * 150 / Number(itMax);

const Viewer = ({ state }: Object) => {
  return (
    <div style={{ width: '600px', height: '600px', margin: 'auto' }}>
      <WordCloud
        data={state.data}
        fontSizeMapper={word => fontSizeMapper(state.iMax, word)}
        width="600"
        height="600"
      />
    </div>
  );
};
Viewer.displayName = 'Viewer';

const prepareDisplay = state => {
  const iMax = Object.values(state).reduce(
    (acc, curr) => Math.max(Number(acc), Number(curr)),
    1
  );
  const data = [...Object.keys(state).map(w => ({ text: w, value: state[w] }))];
  return { iMax, data };
};

const mergeLog = (state, log, activity) => {
  const tmp = String(log.value);
  if (tmp)
    tmp
      .split(/[ :;?_().!,]/)
      .map(x => x.trim())
      .filter(x => !isEmpty(x))
      .map(x => x.toLowerCase())
      .forEach(word => (state[word] ? (state[word] += 1) : (state[word] = 1)));
};

const initData = {};

export default {
  wordcloud: {
    Viewer,
    mergeLog,
    initData,
    prepareDisplay
  }
};
