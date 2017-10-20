// @flow

import React from 'react';
import { uuid, A } from 'frog-utils';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
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

const red = '#AA0000';
const blue = '#0000FF';
const grey = '#A0A0A0';
const chooseColor = (vote, isUp) => {
  switch (vote) {
    case -1:
      return isUp ? grey : red;
    case 1:
      return isUp ? blue : grey;
    default:
      return grey;
  }
};

const Idea = ({ individualVote, fun, idea, remove }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <A onClick={() => fun.vote(idea.id, -1)}>
          <Glyphicon
            style={{
              color: chooseColor(individualVote, false),
              marginRight: '10px'
            }}
            glyph="thumbs-down"
          />
        </A>
        <A onClick={() => fun.vote(idea.id, 1)}>
          <Glyphicon
            style={{
              color: chooseColor(individualVote, true),
              marginRight: '10px'
            }}
            glyph="thumbs-up"
          />
        </A>
        <Badge>{idea.score}</Badge>
      </div>
    </font>
    <b>{idea.title}</b>
    <div>
      {idea.content}
      {remove && (
        <font size={4}>
          <A onClick={() => fun.del(idea)}>
            <Glyphicon glyph="scissors" style={{ float: 'right' }} />
          </A>
        </font>
      )}
    </div>
  </ListGroupItem>
);

const IdeaList = ({ userInfo, data, ideas, fun }) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {values(ideas)
          .sort((a, b) => b.score - a.score)
          .map(idea => {
            const individualVote = data[idea.id].students[userInfo.id];
            return (
              <div key={idea.id}>
                <Idea {...{ individualVote, idea, fun, key: idea.id }} />
              </div>
            );
          })}
      </FlipMove>
    </ListGroup>
  </div>
);

const schema = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Idea'
    },
    content: {
      type: 'string',
      title: 'Text'
    }
  }
};

const ActivityRunner = ({
  userInfo,
  logger,
  activityData,
  data,
  dataFn
}: ActivityRunnerT) => {
  const onSubmit = e => {
    if (e.formData && e.formData.title && e.formData.content) {
      const id = uuid();
      logger({
        type: 'idea',
        itemId: id,
        value: e.formData.title + '\n' + e.formData.content
      });
      dataFn.objInsert({ score: 0, id, students: {}, ...e.formData }, id);
    }
  };

  const vote = (id, incr) => {
    logger({ key: userInfo.name, type: 'vote', itemId: id, value: incr });
    switch (data[id].students[userInfo.id]) {
      case -1:
        if (incr < 0) {
          dataFn.objInsert(0, [id, 'students', userInfo.id]);
          dataFn.numIncr(1, [id, 'score']);
        } else {
          dataFn.objInsert(1, [id, 'students', userInfo.id]);
          dataFn.numIncr(2, [id, 'score']);
        }
        break;
      case 1:
        if (incr < 0) {
          dataFn.objInsert(-1, [id, 'students', userInfo.id]);
          dataFn.numIncr(-2, [id, 'score']);
        } else {
          dataFn.objInsert(0, [id, 'students', userInfo.id]);
          dataFn.numIncr(-1, [id, 'score']);
        }
        break;
      default:
        dataFn.objInsert(incr, [id, 'students', userInfo.id]);
        dataFn.numIncr(incr, [id, 'score']);
    }
  };

  const del = item => dataFn.objDel(item, item.id);
  const formBoolean = activityData.config.formBoolean;
  const fun = { vote, del, formBoolean };
  return (
    <div>
      <Container>
        <ListContainer>
          <p>{activityData.config.text}</p>
          <IdeaList ideas={data} data={data} userInfo={userInfo} fun={fun} />
          {formBoolean && <AddIdea onSubmit={onSubmit} />}
        </ListContainer>
      </Container>
    </div>
  );
};

const AddIdea = ({ onSubmit }) => (
  <div>
    <hr
      style={{
        boxShadow: 'inset 0 12px 12px -12px rgba(0, 0, 0, 0.5)',
        height: '12px'
      }}
    />
    <div style={{ width: '500px' }}>
      <Form {...{ schema, onSubmit }}>
        <div
          style={{
            layout: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}
        >
          <Button style={{ marginRight: '20px' }} type="submit" id="addButton">
            Add idea
          </Button>
        </div>
      </Form>
    </div>
  </div>
);

export default ActivityRunner;
