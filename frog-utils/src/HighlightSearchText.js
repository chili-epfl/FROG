// @flow

import * as React from 'react';

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
