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

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: 100%;
`;

const ListContainer = styled.div`
  padding: 2%;
  width: 100%;
`;
const styles = {
  button: {
    width: 'auto',
    margin: '10px',
    marginRight: '20px',
    position: 'relative',
    whiteSpace: 'normal',
    float: 'center',
    display: 'inline-block'
  }
};

const Answer = ({ rank, answer }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <A onClick={() => rank(answer.id, 1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: '#A0A0A0'
            }}
            glyph="arrow-down"
          />
        </A>
        <A onClick={() => rank(answer.id, -1)}>
          <Glyphicon
            style={{
              marginRight: '10px',
              color: '#A0A0A0'
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

const AnswerList = ({ answers, rank }) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {values(answers)
          .sort((a, b) => a.rank - b.rank)
          .map(answer => (
            <div key={answer.id}>
              <Answer {...{ answer, rank, key: answer.id }} />
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
  const onClick = (title, rank, id) => () => {
    // logger({
    //   type: 'idea',
    //   itemId: id,
    //   value: answer
    // });
    dataFn.objInsert({ rank, id, title }, ['rankedAnswers', id]);
    const delItem = Object.keys(data.initialAnswers).find(
      key => data.initialAnswers[key] === title
    );
    dataFn.listDel(title, ['initialAnswers', delItem]);
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
      // logger({ type: 'rank', itemId: id, value: incr });
      dataFn.numIncr(incr, ['rankedAnswers', id, 'rank']);
      dataFn.numIncr(-incr, ['rankedAnswers', switchID, 'rank']);
    }
  };

  return (
    <div className="bootstrap">
      <Container>
        <ListContainer>
          <p>{activityData.config.guidelines}</p>
          <AnswerList answers={data.rankedAnswers} rank={rank} />
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
                  <AddIdea
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
    </div>
  );
};

const AddIdea = ({ onClick, title, data }) => {
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
