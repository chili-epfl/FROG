// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import Highlighter from 'react-highlight-words';

// the actual component that the student sees
const ActivityRunner = ({ activityData, data, dataFn, userInfo, logger }) => {
  const onClick = () => {
    const s = window.getSelection();
    if (s.isCollapsed) {
      s.modify('move', 'forward', 'character');
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      const selected = s.toString().toLowerCase();
      s.modify('move', 'forward', 'character'); // clear selection

      if (data[selected] === undefined) {
        dataFn.objInsert([userInfo.id], selected);
        logger({ type: 'plus', value: selected });
      } else if (!data[selected].includes(userInfo.id)) {
        dataFn.objReplace(
          data[selected],
          [...data[selected], userInfo.id],
          selected
        );
        logger({ type: 'plus', value: selected });
      } else if (data[selected].length > 1) {
        dataFn.objReplace(
          data[selected],
          data[selected].filter(u => u !== userInfo.id),
          selected
        );
        logger({ type: 'minus', value: selected });
      } else {
        dataFn.objDel(data[selected], selected);
        logger({ type: 'minus', value: selected });
      }
    }
  };

  const findChunks = ({ searchWords, textToHighlight }) =>
    searchWords
      .filter(searchWord => searchWord) // Remove empty words
      .reduce((chunks, searchWord) => {
        const regex = new RegExp('(' + searchWord + ')\\b', 'gi');
        let match = regex.exec(textToHighlight);
        while (match) {
          const start = match.index;
          const end = regex.lastIndex;
          // We do not return zero-length matches
          if (end > start) {
            chunks.push({ start, end });
          }
          // Prevent browsers like Firefox from getting stuck in an infinite loop
          // See http://www.regexguru.com/2008/04/watch-out-for-zero-length-matches/
          if (match.index === regex.lastIndex) {
            regex.lastIndex += 1;
          }
          match = regex.exec(textToHighlight);
        }
        return chunks;
      }, []);

  return (
    <div
      onClick={onClick}
      style={{
        height: '100%',
        overflow: 'scroll',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Highlighter
        searchWords={Object.keys(data).filter(x =>
          data[x].includes(userInfo.id)
        )}
        autoEscape
        textToHighlight={
          activityData.config ? activityData.config.title || '' : ''
        }
        highlightStyle={{
          backgroundColor: 'yellow',
          fontSize: 'xx-large',
          cursor: 'help'
        }}
        unhighlightStyle={{ fontSize: 'xx-large', cursor: 'help' }}
        findChunks={findChunks}
      />
      <Highlighter
        searchWords={Object.keys(data).filter(x =>
          data[x].includes(userInfo.id)
        )}
        autoEscape
        highlightStyle={{ backgroundColor: 'yellow', cursor: 'help' }}
        unhighlightStyle={{ cursor: 'help' }}
        textToHighlight={
          activityData.config ? activityData.config.text || '' : ''
        }
        findChunks={findChunks}
      />
    </div>
  );
};

export default (ActivityRunner: ActivityRunnerT);
