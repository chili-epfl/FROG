// @flow

import * as React from 'react';
import {
  type ActivityRunnerT,
  unicodeLetter,
  notUnicodeLetter
} from 'frog-utils';
import { times } from 'lodash';

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

const unicodeWordRegexp = new RegExp(
  `${notUnicodeLetter}(${unicodeLetter}+)${notUnicodeLetter}`,
  'ui'
);
const unicodeWordRegexpBeg = new RegExp(
  `^(${unicodeLetter}+)${notUnicodeLetter}`,
  'ui'
);
const unicodeWordRegexpEnd = new RegExp(
  `${notUnicodeLetter}(${unicodeLetter}+)$`,
  'ui'
);
const unicodeWordRegexpBegEnd = new RegExp(`^(${unicodeLetter}+)$`, 'ui');

const ActivityRunner = ({ activityData, data, dataFn, logger }) => {
  const wordPhrases =
    activityData.config.wordPhrases &&
    activityData.config.wordPhrases.split(',').map(x => x.trim().toLowerCase());
  const wordPhrasesRegExp =
    wordPhrases && new RegExp(wordPhrases.join('|'), 'gui');
  console.log(wordPhrasesRegExp);

  const selectPenColor = color =>
    dataFn.objReplace(data.currentColor, color, 'currentColor');

  const onClick = () => {
    const s = window.getSelection();
    if (s.isCollapsed) {
      s.modify('move', 'forward', 'character');
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      let sStr = s.toString().trim();
      wordPhrases.forEach(wF => {
        console.log(wF, sStr);
        if (wF.includes(sStr)) {
          console.log('hit');
          const words = wF.split(' ');
          const idx = words.findIndex(x => x === sStr);

          console.log(idx);
          times(idx, () => s.modify('move', 'backward', 'word'));
          times(words.length - idx - 1, () =>
            s.modify('extend', 'forward', 'word')
          );

          sStr = s.toString().trim();
          console.log(idx + 1, words.length - idx - 1, sStr);
        }
      });
      // s.modify('move', 'forward', 'character'); // clear selection

      const sel =
        (wordPhrasesRegExp && sStr.match(wordPhrasesRegExp)) ||
        sStr.match(unicodeWordRegexpBegEnd) ||
        sStr.match(unicodeWordRegexpBeg) ||
        sStr.match(unicodeWordRegexpEnd) ||
        sStr.match(unicodeWordRegexp);

      console.log(sel);
      const selectedRaw = sel && sel[1];
      if (!selectedRaw) {
        return;
      }
      const selected = selectedRaw.toLowerCase().trim();

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
          flexDirection: 'column',
          margin: '20px',
          fontSize: '1.5em',
          lineHeight: '150%',
          fontFamily: 'serif',
          whiteSpace: 'pre-wrap'
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
        <br />
        {activityData.config.text && (
          <Highlighter
            searchWords={data['highlighted']}
            highlightStyle={{ cursor: 'help' }}
            unhighlightStyle={{ cursor: 'help' }}
            textToHighlight={activityData.config.text}
          />
        )}
      </div>
    </>
  );
};

export default (ActivityRunner: ActivityRunnerT);
