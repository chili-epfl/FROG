// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
import { type LogDBT } from 'frog-utils';

const fontSizeMapper = word => Math.max(10, Math.min(word.value * 10, 250));

const Viewer = ({ data }: Object) => (
  <div>
    <WordCloud
      data={[...Object.keys(data).map(w => ({ text: w, value: data[w] }))]}
      fontSizeMapper={fontSizeMapper}
    />
  </div>
);

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  const tmp = String(log.value);
  if (tmp)
    tmp
      .split(' ')
      .forEach(word => dataFn.objInsert((data[word] || 0) + 1, word));
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
