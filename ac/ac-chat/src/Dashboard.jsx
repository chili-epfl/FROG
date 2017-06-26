// @flow

import React from 'react';
import WordCloud from 'react-d3-cloud';

const fontSizeMapper = word => Math.max(10, Math.min(word.value * 10, 250));

export default ({ logs }: any) => {
  const data = {};
  logs.forEach(log => {
    log.chat.split(' ').forEach(word => {
      data[word] = (data[word] || 0) + 1;
    });
  });

  return (
    <div>
      <p>{logs.length} logs</p>
      <WordCloud
        data={[
          ...Object.keys(data).map(word => ({ text: word, value: data[word] }))
        ]}
        fontSizeMapper={fontSizeMapper}
      />
    </div>
  );
};
