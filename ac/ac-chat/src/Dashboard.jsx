// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';
import { isEmpty } from 'lodash';
import { type LogDBT } from 'frog-utils';

const fontSizeMapper = (itMax, word) => 10 + word.value * 150 / Number(itMax);

const Viewer = ({ data }: Object) => {
  const iMax = Object.values(data).reduce(
    (acc, curr) => Math.max(Number(acc), Number(curr)),
    1
  );
  return (
    <div style={{ width: '600px', height: '600px', margin: 'auto' }}>
      <WordCloud
        data={[...Object.keys(data).map(w => ({ text: w, value: data[w] }))]}
        fontSizeMapper={word => fontSizeMapper(iMax, word)}
        width="600"
        height="600"
      />
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  const tmp = log.value && String(log.value);

  if (tmp)
    tmp
      .split(/[ _().!,]/)
      .map(x => x.trim())
      .filter(x => !isEmpty(x))
      .forEach(
        word =>
          data[word]
            ? dataFn.numIncr(1, word)
            : dataFn.objInsert((data[word] || 0) + 1, word)
      );
};

const initData = {};

export default {
  wordcloud: {
    Viewer,
    mergeLog,
    initData
  }
};
