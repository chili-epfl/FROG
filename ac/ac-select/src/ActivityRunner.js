// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import Highlighter from './Highlighter';

const ColorOptions = [
  ['#FFFF00', 'Yellow'],
  ['#FF0000', 'Red'],
  ['#0000FF', 'Blue'],
  ['#32CD32', 'Green']
];

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
            style: {
              backgroundColor: activityData.config.multi
                ? TextToColor(selected)
                : data.currentColor
            }
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
  const colorOptions = ColorOptions.map(colorOption => {
    const color = colorOption[0];
    const style = {
      background: color,
      color: 'white',
      width: '16px',
      height: '16px',
      borderRadius: '8px',
      border: 'none'
    };

    return (
      <div
        key={'penColor' + color}
        style={{
          width: '19px',
          height: '19px',
          border: 'solid 1px',
          borderColor: data.currentColor === color ? 'black' : 'white',
          margin: '2px'
        }}
      >
        <button onClick={() => selectPenColor(color)} style={style} />
      </div>
    );
  });

  const drawingItemsStyle = {
    width: '15%',
    minWidth: '125px',
    display: 'flex',
    flexDirection: 'row'
  };

  const toolbarStyle = {
    minHeight: '50px',
    paddingTop: '5px',
    borderBottom: '1px solid lightblue',
    marginBottom: '5px'
  };
  return (
    <>
      {activityData.config.chooseColor && (
        <div style={toolbarStyle}>
          <div style={drawingItemsStyle}>{colorOptions}</div>
        </div>
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
            backgroundColor: 'yellow',
            fontSize: 'xx-large',
            cursor: 'help'
          }}
          unhighlightStyle={{ fontSize: 'xx-large', cursor: 'help' }}
        />
        <Highlighter
          searchWords={data['highlighted']}
          highlightStyle={{ backgroundColor: 'yellow', cursor: 'help' }}
          unhighlightStyle={{ cursor: 'help' }}
          textToHighlight={
            activityData.config ? activityData.config.text || '' : ''
          }
        />
      </div>
    </>
  );
};

export default (ActivityRunner: ActivityRunnerT);
