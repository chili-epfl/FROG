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
import { getXYFromRanking } from './Dashboard';

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
        <A onClick={() => rank(answer, 1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color:
                answers[answer] === Object.keys(answers).length ? grey : blue
            }}
            glyph="arrow-down"
          />
        </A>
        <A onClick={() => rank(answer, -1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: answers[answer] === 1 ? grey : blue
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

const ActivityRunner = (props: ActivityRunnerT) => {
  const { activityData: { config }, logger, dataFn, userInfo, data } = props;
  const { answers, justification } = data;

  const onClick = (title, rank) => () => {
    const newAnswers = answers[userInfo.id] || {};
    newAnswers[title] = rank;

    const progress = answers[userInfo.id]
      ? nKey(newAnswers) / config.answers.length
      : 0;

    logger([
      {
        type: 'listAdd',
        itemId: title,
        payload: newAnswers
      },
      {
        type: 'progress',
        value: config.justify ? progress / 2 : progress
      },
      {
        type: 'coordinates',
        payload: getXYFromRanking(newAnswers, config)
      }
    ]);
    dataFn.objInsert(newAnswers, ['answers', userInfo.id]);
  };

  const done =
    answers[userInfo.id] &&
    nKey(answers[userInfo.id]) === nKey(config.answers) &&
    (!config.justify || justification.length > 0);

  const onSubmit = () => {
    if (done) {
      dataFn.objInsert(true, ['completed']);
      logger([{ type: 'progress', value: 1 }]);
    }
  };

  const changeRank = (title, incr) => {
    const ans = answers[userInfo.id];
    if (
      !(ans[title] === 1 && incr < 0) &&
      !(ans[title] === nKey(ans) && incr > 0)
    ) {
      const newAnswers = { ...ans };
      const switchID = findKey(ans, x => x === ans[title] + incr);
      newAnswers[title] += incr;
      newAnswers[switchID] -= incr;
      logger([
        {
          type: 'listOrder',
          itemId: title,
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

  return (
    <div className="bootstrap">
      <Container>
        {data.completed ? (
          <Completed {...props} />
        ) : (
          <ListContainer>
            <p>{config.guidelines}</p>
            <AnswerList answers={answers[userInfo.id]} rank={changeRank} />
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
                  {config.answers
                    .filter(ans => !(answers[userInfo.id] || {})[ans])
                    .map(ans => (
                      <AddAnswer
                        onClick={onClick}
                        title={ans}
                        rank={nKey(answers[userInfo.id] || {})}
                        key={ans}
                      />
                    ))}
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
                  backgroundColor: !done ? grey : blue,
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
