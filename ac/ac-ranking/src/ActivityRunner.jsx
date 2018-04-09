// @flow

import * as React from 'react';
import styled from 'styled-components';
import { A } from 'frog-utils';
import FlipMove from '@houshuang/react-flip-move';
import { findKey } from 'lodash';
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

const blue = '#337ab7';
const grey = '#d3d3d3';
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
    backgroundColor: blue,
    color: '#FFF'
  }
};

const Completed = ({ dataFn }) => (
  <React.Fragment>
    <h1>Activity completed!</h1>
    <div style={{ width: '100%' }}>
      <button
        style={{ ...styles.button }}
        onClick={() => dataFn.objInsert(false, ['completed'])}
      >
        Back to activity
      </button>
    </div>
  </React.Fragment>
);

const Answer = ({ rank, answer, answers }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <A onClick={() => rank(answer, 1, answers)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: chooseColor(
                answers[answer] === Object.keys(answers).length
              )
            }}
            glyph="arrow-down"
          />
        </A>
        <A onClick={() => rank(answer, -1, answers)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: chooseColor(answers[answer] === 1)
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
      {answers[answer]}
    </Badge>
    <b>{answer}</b>
  </ListGroupItem>
);

const AnswerList = ({ answers, rank }) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {Object.keys(answers || {})
          .sort((a, b) => answers[a] - answers[b])
          .map(answer => (
            <div key={answer}>
              <Answer {...{ answer, rank, answers, key: answer }} />
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
  dataFn,
  userInfo
}: ActivityRunnerT) => {
  const props = { activityData, logger, dataFn, userInfo };

  const onClick = (title, rank) => () => {
    const prog =
      (Object.keys(data.answers[userInfo.id] || {}).length -
        Object.keys(activityData.data || {}).length +
        1) /
      activityData.config.answers.length;
    const answersList = data.answers[userInfo.id] || {};
    answersList[title] = rank;

    logger([
      {
        type: 'listAdd',
        itemId: title,
        value: JSON.stringify(answersList)
      },
      {
        type: 'progress',
        value: activityData.config.justify ? prog / 2 : prog
      }
    ]);
    if (!data.answers[userInfo.id]) {
      dataFn.objInsert({}, ['answers', userInfo.id]);
    }
    dataFn.objInsert(rank, ['answers', userInfo.id, title]);
  };

  const done =
    data.answers[userInfo.id] &&
    Object.keys(data.answers[userInfo.id] || {}).length ===
      Object.keys(activityData.config.answers).length +
        Object.keys(activityData.data || {}).length &&
    (!activityData.config.justify || data.justification.length > 0);

  const onSubmit = () => {
    if (done) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  const rank = (title, incr, answers) => {
    if (
      !(answers[title] === 1 && incr < 0) &&
      !(answers[title] === Object.keys(answers).length && incr > 0)
    ) {
      const answersList = answers;
      const switchID = findKey(answers, x => x === answers[title] + incr);

      answersList[title] += incr;
      answersList[switchID] -= incr;

      logger({
        type: 'listOrder',
        itemId: title,
        value: JSON.stringify(answersList)
      });
      dataFn.numIncr(incr, ['answers', userInfo.id, title]);
      dataFn.numIncr(-incr, ['answers', userInfo.id, switchID]);
    }
  };

  return (
    <div className="bootstrap">
      <Container>
        {data.completed ? (
          <Completed {...props} />
        ) : (
          <ListContainer>
            <p>{activityData.config.guidelines}</p>
            <AnswerList answers={data.answers[userInfo.id]} rank={rank} />
            <hr style={{ height: '5px' }} />
            <div>
              <div style={{ width: '100%' }}>
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    display: 'block'
                  }}
                >
                  {activityData.config.answers.map(ans => {
                    if (
                      !Object.keys(data.answers[userInfo.id] || {}).includes(
                        ans.choice
                      )
                    ) {
                      return (
                        <AddAnswer
                          onClick={onClick}
                          title={ans.choice}
                          rank={
                            Object.keys(data.answers[userInfo.id] || {})
                              .length || 0
                          }
                          key={ans.choice}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </div>
              </div>
            </div>
            <hr style={{ height: '5px' }} />
            <Justification {...props} key="justification" />
            <div>
              <button
                onClick={onSubmit}
                key="submit"
                style={{
                  ...styles.button,
                  backgroundColor: chooseColor(!done),
                  marginLeft: '0px'
                }}
              >
                Submit
              </button>
            </div>
          </ListContainer>
        )}
      </Container>
    </div>
  );
};

const AddAnswer = ({ onClick, title, rank }) => (
  <Button
    style={{ ...styles.button }}
    key={title}
    onClick={onClick(title, rank + 1)}
  >
    {rank + 1 + ' ' + title}
  </Button>
);

export default ActivityRunner;
