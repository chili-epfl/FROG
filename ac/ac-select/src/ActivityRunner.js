// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import Highlighter from 'react-highlight-words';

// the actual component that the student sees
const ActivityRunner = ({ activityData, data, dataFn, userInfo, logger }) => {
  const onClick = () => {
    const s = window.getSelection();
    let selected = '';
    if (s.isCollapsed) {
      s.modify('move', 'forward', 'character');
      s.modify('move', 'backward', 'word');
      s.modify('extend', 'forward', 'word');
      selected = s.toString().toLowerCase();
      s.modify('move', 'forward', 'character'); // clear selection
    }
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
  };
  return (
    <div onClick={onClick}>
      <h1>{activityData.config ? activityData.config.title : ''}</h1>
      <Highlighter
        searchWords={Object.keys(data).filter(x =>
          data[x].includes(userInfo.id)
        )}
        autoEscape
        textToHighlight={
          activityData.config ? activityData.config.text || '' : ''
        }
      />
    </div>
  );
};

export default (ActivityRunner: ActivityRunnerT);
