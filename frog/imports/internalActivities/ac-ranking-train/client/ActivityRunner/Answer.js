// @flow

import * as React from 'react';
import { A } from '/imports/frog-utils';
import { findKey } from 'lodash';
import { Badge, Glyphicon, ListGroupItem } from 'react-bootstrap';

import { getXYFromRanking } from '../Dashboard';

const blue = '#337ab7';
const grey = '#d3d3d3';

const nKey = x => Object.keys(x).length;

const changeRank = (props, incr) => {
  const {
    activityData: { config },
    logger,
    dataFn,
    userInfo,
    data,
    answer
  } = props;
  const { answers } = data;

  const ans = answers[data.round][userInfo.id];

  if (
    !(ans[answer] === 1 && incr < 0) &&
    !(ans[answer] === nKey(ans) && incr > 0)
  ) {
    const newAnswers = { ...ans };
    const switchID = findKey(ans, x => x === ans[answer] + incr);
    newAnswers[answer] += incr;
    newAnswers[switchID] -= incr;

    const coordinates = getXYFromRanking(newAnswers, config);
    if (props.data.round === 1) {
      dataFn.objInsert(coordinates, 'coordinates');
    }
    logger([
      {
        type: 'listOrder',
        itemId: answer,
        value: JSON.stringify(newAnswers),
        payload: { round: props.data.round }
      },
      {
        type: 'coordinates',
        payload: coordinates,
        round: props.data.round
      }
    ]);
    dataFn.objInsert(newAnswers, ['answers', data.round, userInfo.id]);
  }
};

export default (props: Object) => {
  const { answer, memAnswers, userID, uiID } = props;
  return (
    <ListGroupItem>
      <font size={4}>
        {userID === uiID && (
          <div style={{ float: 'right' }}>
            <A onClick={() => changeRank(props, 1)}>
              <Glyphicon
                style={{
                  marginRight: '10px',
                  color:
                    memAnswers[answer] === Object.keys(memAnswers).length
                      ? grey
                      : blue
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
