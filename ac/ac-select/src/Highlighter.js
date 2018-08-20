// @flow

import * as React from 'react';
import memoizeOne from 'memoize-one'
import { findAll } from './HighlighterUtils'

export default  ({
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
  unhighlightStyle,
  colorFun,
  multicolor = false
}) => {
  const chunks = findAll({
    autoEscape: true,
    caseSensitive,
    sanitize,
    searchWords: searchWords.map(x => x.word),
    textToHighlight
  })
  const HighlightTag = 'mark'
  let highlightCount = -1
  let highlightClassNames = ''
  let highlightStyles

  const lowercaseProps = object => {
    const mapped = {}
    Object.keys(object).forEach(key => mapped[key.toLowerCase()] = object[key])
    return mapped
  }
  const memoizedLowercaseProps = memoizeOne(lowercaseProps)

  return (
    <span className={className}>
      {chunks.map((chunk) => {
        const text = textToHighlight.substr(chunk.start, chunk.end - chunk.start)

        if (chunk.highlight) {
          highlightCount += 1

          let highlightClass
          if (typeof highlightClassName === 'object') {
            if (!caseSensitive) {
              const highlightClassNameTmp = memoizedLowercaseProps(highlightClassName)
              highlightClass = highlightClassNameTmp[text.toLowerCase()]
            } else {
              highlightClass = highlightClassName[text]
            }
          } else {
            highlightClass = highlightClassName
          }

          const isActive = highlightCount === +activeIndex

          highlightClassNames = `${highlightClass} ${isActive ? activeClassName : ''}`
          highlightStyles = isActive === true && activeStyle != null
            ? Object.assign({}, highlightStyle, activeStyle)
            : highlightStyle
          console.log(searchWords)
          return (
            <HighlightTag
              className={highlightClassNames}
              key={chunk.start+chunk.end}
              style={multicolor ? {...highlightStyles, backgroundColor: searchWords.find(x => x['word'] === text)['color']} : highlightStyles}
            >
              {text}
            </HighlightTag>
          )
        } else {
          return (
            <span
              className={unhighlightClassName}
              key={chunk.start+chunk.end}
              style={unhighlightStyle}
            >
              {text}
            </span>
          )
        }
      })}
    </span>
  )
}
