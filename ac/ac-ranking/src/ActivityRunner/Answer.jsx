// @flow

import * as React from 'react';
import { A } from 'frog-utils';
import { findKey } from 'lodash';
import {
  Badge,
  Glyphicon,
  ListGroupItem
} from 'react-bootstrap';

import { getXYFromRanking } from '../Dashboard';

const blue = '#337ab7';
const grey = '#d3d3d3';

const nKey = x => Object.keys(x).length;

const changeRank = (props, incr) => {
  const { activityData: { config }, logger, dataFn, userInfo, data, answer } = props;
  const { answers } = data;

  const ans = answers[userInfo.id];

  if (
    !(ans[answer] === 1 && incr < 0) &&
    !(ans[answer] === nKey(ans) && incr > 0)
  ) {
    const newAnswers = { ...ans };
    const switchID = findKey(ans, x => x === ans[answer] + incr);
    newAnswers[answer] += incr;
    newAnswers[switchID] -= incr;

    logger([
      {
        type: 'listOrder',
        itemId: answer,
        value: JSON.stringify(newAnswers)
      },
      {
        type: 'coordinates',
        payload: getXYFromRanking(newAnswers, config)
      }
    ]);
    dataFn.objInsert(newAnswers, ['answers', userInfo.id]);
  }
};


export default (props: Object) => {
  const {answer, memAnswers, userID, uiID} = props;
  return (
  <ListGroupItem>
    <font size={4}>
      {userID.toString() === uiID.toString() && (
        <div style={{ float: 'right' }}>
          <A onClick={() => changeRank(props, 1)}>
            <Glyphicon
              style={{
                marginRight: '10px',
                color:
                  memAnswers[answer] === Object.keys(memAnswers).length ? grey : blue
              }}
              glyph="arrow-down"
            />
          </A>
          <A onClick={() => changeRank(props, -1)}>
            <Glyphicon
              style={{
                marginRight: '10px',
                color: memAnswers[answer] === 1 ? grey : blue
              }}
              glyph="arrow-up"
            />
          </A>
        </div>
      )}
    </font>
    <Badge
      style={{
        marginRight: '10px'
      }}
    >
      {memAnswers[answer]}
    </Badge>
    <b>{answer}</b>
  </ListGroupItem>
);
};
