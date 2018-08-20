// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import Highlighter from './Highlighter';

const TextToColor = text => {
  const c = Number(
    text
      .toLowerCase()
      .split('')
      .reduce((acc, cur) => acc + cur.charCodeAt(), '')
  );
  const obj = {
    r: 90 + Math.floor((c % (166 * 166 * 166)) / (166 * 166)),
    g: 90 + Math.floor((c % (166 * 166)) / 166),
    b: 90 + (c % 166)
  };
  return 'rgb(' + obj.r + ',' + obj.g + ',' + obj.b + ')';
};

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
        searchWords={Object.keys(data)
          .filter(x => data[x].includes(userInfo.id))
          .map(x => ({
            word: x,
            color: activityData.config.multi ? TextToColor(x) : undefined
          }))}
        textToHighlight={
          activityData.config ? activityData.config.title || '' : ''
        }
        highlightStyle={{
          backgroundColor: 'yellow',
          fontSize: 'xx-large',
          cursor: 'help'
        }}
        unhighlightStyle={{ fontSize: 'xx-large', cursor: 'help' }}
      />
      <Highlighter
        searchWords={Object.keys(data)
          .filter(x => data[x].includes(userInfo.id))
          .map(x => ({
            word: x,
            color: activityData.config.multi ? TextToColor(x) : undefined
          }))}
        highlightStyle={{ backgroundColor: 'yellow', cursor: 'help' }}
        unhighlightStyle={{ cursor: 'help' }}
        textToHighlight={
          activityData.config ? activityData.config.text || '' : ''
        }
      />
    </div>
  );
};

export default (ActivityRunner: ActivityRunnerT);
