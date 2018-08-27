// @flow

import * as React from 'react';
import memoizeOne from 'memoize-one';
import Tooltip from '@material-ui/core/Tooltip';

import { findAll } from './HighlighterUtils';

export default ({
  activeClassName = '',
  activeIndex = -1,
  activeStyle,
  caseSensitive = false,
  className,
  highlightClassName = '',
  highlightStyle = {},
  sanitize,
  searchWords,
  textToHighlight,
  unhighlightClassName = '',
  unhighlightStyle
}: Object) => {
  const chunks = findAll({
    autoEscape: true,
    caseSensitive,
    sanitize,
    searchWords: Object.keys(searchWords),
    textToHighlight
  });
  const HighlightTag = 'mark';
  let highlightCount = -1;
  let highlightClassNames = '';
  let highlightStyles;

  const lowercaseProps = object => {
    const mapped = {};
    Object.keys(object).forEach(
      key => (mapped[key.toLowerCase()] = object[key])
    );
    return mapped;
  };
  const memoizedLowercaseProps = memoizeOne(lowercaseProps);
  return (
    <span className={className}>
      {chunks.map(chunk => {
        const text = textToHighlight.substr(
          chunk.start,
          chunk.end - chunk.start
        );
        console.log(chunk, text);

        if (chunk.highlight) {
          highlightCount += 1;

          let highlightClass;
          if (typeof highlightClassName === 'object') {
            if (!caseSensitive) {
              const highlightClassNameTmp = memoizedLowercaseProps(
                highlightClassName
              );
              highlightClass = highlightClassNameTmp[text.toLowerCase()];
            } else {
              highlightClass = highlightClassName[text];
            }
          } else {
            highlightClass = highlightClassName;
          }

          const isActive = highlightCount === +activeIndex;

          highlightClassNames = `${highlightClass} ${
            isActive ? activeClassName : ''
          }`;
          highlightStyles =
            isActive === true && activeStyle != null
              ? Object.assign({}, highlightStyle, activeStyle)
              : highlightStyle;
          const word = searchWords[text.toLowerCase()];
          console.log(searchWords[text], searchWords[text.toLowerCase()]);
          return (
            <Tooltip
              title={word && word.vote ? word.vote.toString() : ''}
              key={chunk.start + chunk.end}
            >
              <HighlightTag
                className={highlightClassNames}
                style={{
                  ...highlightStyles,
                  backgroundColor: word.color,
                  filter:
                    'brightness(' +
                    (100 - (word.vote ? word.vote - 1 : 0) * 10) +
                    '%)'
                }}
              >
                {text}
              </HighlightTag>
            </Tooltip>
          );
        } else {
          return (
            <span
              className={unhighlightClassName}
              key={chunk.start + chunk.end}
              style={unhighlightStyle}
            >
              {text}
            </span>
          );
        }
      })}
      <br />
    </span>
  );
};
