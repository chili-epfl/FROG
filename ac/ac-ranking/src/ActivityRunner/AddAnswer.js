// @flow

import * as React from 'react';
import { Button } from 'react-bootstrap';

import { getXYFromRanking } from '../Dashboard';

const blue = '#337ab7';

const nKey = x => Object.keys(x).length;

const styles = {
  button: {
    width: 'auto',
    margin: '10px',
    marginRight: '20px',
    position: 'relative',
    whiteSpace: 'normal',
    float: 'center',
    display: 'inline-block',
    backgroundColor: blue,
    color: '#FFF'
  }
};

const onClick = props => () => {
  const {
    activityData: { config },
    logger,
    dataFn,
    userInfo,
    data,
    title,
    rank
  } = props;
  const { answers } = data;

  const newAnswers = answers[userInfo.id] || {};
  newAnswers[title] = rank + 1;

  const progress = answers[userInfo.id]
    ? nKey(newAnswers) / config.answers.length
    : 0;

  const coordinates = getXYFromRanking(newAnswers, config);
  dataFn.objInsert(coordinates, 'coordinates');
  logger([
    {
      type: 'listAdd',
      itemId: title,
      value: JSON.stringify(newAnswers)
    },
    {
      type: 'progress',
      value: config.mustJustify ? progress / 2 : progress
    },
    {
      type: 'coordinates',
      payload: coordinates
    }
  ]);
  dataFn.objInsert(rank + 1, ['answers', userInfo.id, title]);
};

export default (props: Object) => {
  const { title } = props;
  return (
    <Button style={{ ...styles.button }} key={title} onClick={onClick(props)}>
      {title}
    </Button>
  );
};
