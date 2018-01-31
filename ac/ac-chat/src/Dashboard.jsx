// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
import { type LogDBT } from 'frog-utils';

const fontSizeMapper = (itMax, word) => 10 + word.value * 250 / Number(itMax);

const Viewer = ({ data }: Object) => {
  const iMax = Object.values(data).reduce((acc, curr) =>
    Math.max(Number(acc), Number(curr))
  );
  return (
    <div>
      <WordCloud
        data={[...Object.keys(data).map(w => ({ text: w, value: data[w] }))]}
        fontSizeMapper={word => fontSizeMapper(iMax, word)}
      />
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  const tmp = String(log.value);
  if (tmp)
    tmp
      .split(' ')
      .forEach(
        word =>
          data[word]
            ? dataFn.numIncr(1, word)
            : dataFn.objInsert((data[word] || 0) + 1, word)
      );
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
