// @flow

import React from 'react';
import { uuid, A } from 'frog-utils';
import styled from 'styled-components';
import FlipMove from '@houshuang/react-flip-move';
import { values } from 'lodash';
import {
  Badge,
  Glyphicon,
  Button,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';

import type { ActivityRunnerT } from 'frog-utils';
import Justification from './Justification';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const ListContainer = styled.div`
  padding: 2%;
  width: 100%;
`;

const blue = '#ADD8E6';
const grey = '#A0A0A0';
const chooseColor = disabled => {
  if (disabled) {
    return grey;
  } else {
    return blue;
  }
};

const styles = {
  button: {
    width: 'auto',
    margin: '10px',
    marginRight: '20px',
    position: 'relative',
    whiteSpace: 'normal',
    float: 'center',
    display: 'inline-block',
    backgroundColor: blue
  }
};

const Answer = ({ rank, answer, data }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <A onClick={() => rank(answer.id, 1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: chooseColor(
                answer.rank === Object.keys(data.rankedAnswers).length
              )
            }}
            glyph="arrow-down"
          />
        </A>
        <A onClick={() => rank(answer.id, -1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: chooseColor(answer.rank === 1)
            }}
            glyph="arrow-up"
          />
        </A>
      </div>
    </font>
    <Badge
      style={{
        marginRight: '10px'
      }}
    >
      {answer.rank}
    </Badge>
    <b>{answer.title}</b>
  </ListGroupItem>
);

const AnswerList = ({ answers, rank, data }) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {values(answers)
          .sort((a, b) => a.rank - b.rank)
          .map(answer => (
            <div key={answer.id}>
              <Answer {...{ answer, rank, data, key: answer.id }} />
            </div>
          ))}
      </FlipMove>
    </ListGroup>
  </div>
);

const ActivityRunner = ({
  logger,
  activityData,
  data,
  dataFn
}: ActivityRunnerT) => {
  const props = { activityData, logger, dataFn };
  const onClick = (title, rank, id) => () => {
    const curRank = Object.keys(data.rankedAnswers).map(
      ans =>
        data.rankedAnswers[ans].rank.toString() +
        ': ' +
        data.rankedAnswers[ans].title
    );
    logger([
      {
        type: 'listAdd',
        itemId: id,
        value: curRank.toString() + ',' + rank.toString() + ': ' + title
      },
      {
        type: 'progress',
        value: activityData.config.justify
          ? (1 -
              (Object.keys(data.initialAnswers).length - 1) /
                activityData.config.answers.length) /
            2
          : 1 -
            (Object.keys(data.initialAnswers).length - 1) /
              activityData.config.answers.length
      }
    ]);
    dataFn.objInsert({ rank, id, title }, ['rankedAnswers', id]);
    const delItem = Object.keys(data.initialAnswers).find(
      key => data.initialAnswers[key] === title
    );
    dataFn.listDel(title, ['initialAnswers', delItem]);
  };

  const onSubmit = () => {
    if (
      data.initialAnswers.length <= 0 &&
      (!activityData.config.justify || data.justification.length > 0)
    ) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  const rank = (id, incr) => {
    if (
      !(data.rankedAnswers[id].rank === 1 && incr < 0) &&
      !(
        data.rankedAnswers[id].rank ===
          Object.keys(data.rankedAnswers).length && incr > 0
      )
    ) {
      const switchID = Object.keys(data.rankedAnswers).find(
        key =>
          data.rankedAnswers[key].rank === data.rankedAnswers[id].rank + incr
      );
      const curRank = Object.keys(data.rankedAnswers).map(ans => {
        if (data.rankedAnswers[ans].id === id) {
          return (
            (data.rankedAnswers[ans].rank + incr).toString() +
            ': ' +
            data.rankedAnswers[ans].title
          );
        } else if (data.rankedAnswers[ans].id === switchID) {
          return (
            (data.rankedAnswers[ans].rank - incr).toString() +
            ': ' +
            data.rankedAnswers[ans].title
          );
        } else {
          return (
            data.rankedAnswers[ans].rank.toString() +
            ': ' +
            data.rankedAnswers[ans].title
          );
        }
      });
      logger({ type: 'listOrder', itemId: id, value: curRank.toString() + '' });
      dataFn.numIncr(incr, ['rankedAnswers', id, 'rank']);
      dataFn.numIncr(-incr, ['rankedAnswers', switchID, 'rank']);
    }
  };

  return (
    <div className="bootstrap">
      <Container>
        <ListContainer>
          <p>{activityData.config.guidelines}</p>
          <AnswerList answers={data.rankedAnswers} rank={rank} data={data} />
          <hr
            style={{
              height: '12px'
            }}
          />
          <div>
            <div style={{ width: '100%' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  display: 'block'
                }}
              >
                {data.initialAnswers.map(ans => (
                  <AddAnswer
                    onClick={onClick}
                    title={ans}
                    data={data}
                    key={uuid()}
                  />
                ))}
              </div>
            </div>
          </div>
        </ListContainer>
      </Container>
      <Justification {...props} key="justification" />
      <button
        onClick={onSubmit}
        key="submit"
        style={{
          backgroundColor: chooseColor(
            data.initialAnswers.length > 0 ||
              (activityData.config.justify && data.justification.length === 0)
          )
        }}
      >
        Submit
      </button>
    </div>
  );
};

const AddAnswer = ({ onClick, title, data }) => {
  const id = uuid();
  return (
    <Button
      style={{ ...styles.button }}
      key={id + 'b'}
      onClick={onClick(title, Object.keys(data.rankedAnswers).length + 1, id)}
    >
      {Object.keys(data.rankedAnswers).length + 1 + ' ' + title}
    </Button>
  );
};

export default ActivityRunner;
