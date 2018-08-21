// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import Highlighter from './Highlighter';
import ColorSelect from './ColorSelect';

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
const ActivityRunner = ({ activityData, data, dataFn, logger }) => {
  const selectPenColor = color =>
    dataFn.objReplace(data.currentColor, color, 'currentColor');

  const onClick = () => {
    const s = window.getSelection();
    if (s.isCollapsed) {
      s.modify('move', 'forward', 'character');
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      const selected = s.toString().toLowerCase();
      s.modify('move', 'forward', 'character'); // clear selection

      if (data['highlighted'][selected] === undefined) {
        dataFn.objInsert(
          {
            color: activityData.config.multi
              ? TextToColor(selected)
              : data.currentColor
          },
          ['highlighted', selected]
        );
        logger({ type: 'plus', value: selected });
      } else {
        dataFn.objDel(data['highlighted'][selected], ['highlighted', selected]);
        logger({ type: 'minus', value: selected });
      }
    }
  };
  return (
    <>
      {activityData.config.chooseColor && (
        <ColorSelect {...{ data, selectPenColor }} />
      )}
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
          searchWords={data['highlighted']}
          textToHighlight={
            activityData.config ? activityData.config.title || '' : ''
          }
          highlightStyle={{
            fontSize: 'xx-large',
            cursor: 'help'
          }}
          unhighlightStyle={{ fontSize: 'xx-large', cursor: 'help' }}
        />
        {activityData.config.text &&
          activityData.config.text
            .split('\n')
            .filter(x => x !== '')
            .map(sub => (
              <p key={sub}>
                <Highlighter
                  searchWords={data['highlighted']}
                  highlightStyle={{ cursor: 'help' }}
                  unhighlightStyle={{ cursor: 'help' }}
                  textToHighlight={
                    activityData.config ? activityData.config.text || '' : ''
                  }
                />
              </p>
            ))}
      </div>
    </>
  );
};

export default (ActivityRunner: ActivityRunnerT);
