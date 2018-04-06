// @flow

import * as React from 'react';
import styled from 'styled-components';
import { A } from 'frog-utils';
import { findKey } from 'lodash';
import FlipMove from '@houshuang/react-flip-move';
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

const Answer = ({ rank, ranking, answer, answers, config }) => {
  return (
    <ListGroupItem>
      <font size={4}>
        <div style={{ float: 'right' }}>
          <A onClick={() => rank(answer, 1)}>
            <Glyphicon
              style={{
                marginRight: '10px',
                color: chooseColor(ranking === Object.keys(answers).length - 1)
              }}
              glyph="arrow-down"
            />
          </A>
          <A onClick={() => rank(answer, -1)}>
            <Glyphicon
              style={{
                marginRight: '10px',
                color: chooseColor(ranking === 0)
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
        {ranking + 1}
      </Badge>
      <b>{config.answers[answer].choice}</b>
    </ListGroupItem>
  );
};

const AnswerList = ({ rank, answers, dataFn, config }) => {
  if (!answers) {
    return null;
  }
  return (
    <div>
      <ListGroup className="item">
        <FlipMove duration={750} easing="ease-out">
          {Object.entries(answers)
            .sort((a, b) => a[1] - b[1])
            .map(([answer, ranking]) => (
              <div key={answer}>
                <Answer {...{ answers, answer, ranking, rank, config }} />
              </div>
            ))}
        </FlipMove>
      </ListGroup>
    </div>
  );
};

const ActivityRunner = ({
  logger,
  activityData,
  data,
  dataFn,
  userInfo
}: ActivityRunnerT) => {
  const props = { activityData, logger, dataFn };

  const onSubmit = () => {
    if (
      data.answers[userInfo.id] &&
      Object.keys(data.answers[userInfo.id]).length ===
        Object.keys(activityData.config.answers).length &&
      (!activityData.config.justify || data.justification.length > 0)
    ) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  const rank = (id, incr) => {
    const answers = data.answers[userInfo.id];
    if (
      answers &&
      !(answers[id] === 0 && incr < 0) &&
      !(answers[id] === Object.keys(answers).length - 1 && incr > 0)
    ) {
      answers[findKey(answers, x => x === answers[id] + incr)] += incr * -1;
      answers[id] += incr;
      dataFn.objInsert(answers, ['answers', userInfo.id]);
      logger({
        type: 'listOrder',
        value: JSON.stringify(answers)
      });
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
            <AnswerList
              answers={data.answers[userInfo.id]}
              config={activityData.config}
              dataFn={dataFn}
              rank={rank}
            />
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
                  <AddAnswers
                    dataFn={dataFn}
                    config={activityData.config}
                    data={data}
                    userId={userInfo.id}
                  />
                </div>
              </div>
            </div>
            <hr style={{ height: '5px' }} />
            <Justification {...props} key="justification" />
            <div />
          </ListContainer>
        )}
      </Container>
      {activityData.config.justification && (
        <Justification dataFn={dataFn} logger={logger} />
      )}
      <button
        onClick={onSubmit}
        key="submit"
        style={{
          ...styles.button,
          backgroundColor: chooseColor(),
          marginLeft: '0px'
        }}
      >
        Submit
      </button>
    </div>
  );
};

const AddAnswers = ({ dataFn, data, config, userId }) => {
  let exists = data.answers[userId] && Object.keys(data.answers[userId]);
  if (exists === undefined) {
    dataFn.objInsert({}, ['answers', userId]);
    exists = [];
  }
  return Object.keys(config.answers)
    .filter(x => !exists.includes(x))
    .map(answer => (
      <Button
        style={{ ...styles.button }}
        key={answer}
        onClick={() =>
          dataFn.objInsert(exists.length, ['answers', userId, answer])
        }
      >
        {config.answers[answer].choice + ' ' + (exists.length + 1)}
      </Button>
    ));
};

export default ActivityRunner;
