// @flow

import React from 'react';
import { uuid } from 'frog-utils';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
import FlipMove from 'react-flip-move';
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

const Idea = ({ idea, fun, remove }) =>
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>
          <a href="#" onClick={() => fun.vote(idea.id, -1)}>
            <Glyphicon glyph="thumbs-down" />
          </a>
        </span>
        <span style={{ marginRight: '10px' }}>
          <a href="#" onClick={() => fun.vote(idea.id, 1)}>
            <Glyphicon glyph="thumbs-up" />
          </a>
        </span>
        <Badge>{idea.score}</Badge>
      </div>
    </font>
    <b>{idea.title}</b>
    <div>
      {idea.content}
      {remove &&
        <font size={4}>
          <a href="#" onClick={() => fun.delete(idea)}>
            <Glyphicon glyph="scissors" style={{ float: 'right' }} />
          </a>
        </font>}
    </div>
  </ListGroupItem>;

const IdeaList = ({ ideas, fun, remove }) =>
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {values(ideas).sort((a, b) => b.score - a.score).map(idea =>
          <div key={idea.id}>
            <Idea {...{ idea, fun, remove, key: idea.id }} />
          </div>
        )}
      </FlipMove>
    </ListGroup>
  </div>;

export default ({
  configData,
  object,
  userInfo,
  logger,
  data,
  dataFn,
  saveProduct
}: ActivityRunnerT) => {
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

  const onSubmit = e => {
    if (e.formData && e.formData.title && e.formData.content) {
      const id = uuid();
      logger({ type: 'idea', id });
      dataFn.objInsert({ score: 0, id, ...e.formData }, ['ideas', id]);
    }
  };
  return (
    <div>
      <Container>
        <ListContainer>
          <p>{configData.text}</p>
          <IdeaList
            ideas={data}
            fun={{
              vote: (id, incr) => {
                logger({ key: userInfo.name, type: 'vote' });
                dataFn.numIncr(incr, [id, 'score']);
              },
              delete: item => dataFn.objDel(item, ['ideas', item.id])
            }}
            remove={configData.formBoolean}
          />
          {configData.formBoolean &&
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
                      flexDirection: 'row'
                    }}
                  >
                    <Button
                      style={{ marginRight: '20px' }}
                      type="submit"
                      id="addButton"
                    >
                      Add idea
                    </Button>
                    <Button
                      id="saveButton"
                      bsStyle="primary"
                      onClick={saveProduct('ALL', { ideas: data.ideas })}
                    >
                      Save
                    </Button>
                  </div>
                </Form>
              </div>
            </div>}
        </ListContainer>
      </Container>
    </div>
  );
};
