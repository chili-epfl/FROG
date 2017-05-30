// @flow

import React from 'react';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
import Stringify from 'json-stable-stringify';
import FlipMove from 'react-flip-move';
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

const Idea = ({ idea, fun, remove }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <span style={{ marginRight: '10px' }}>
          <a
            href="#"
            onClick={() =>
              fun.vote(idea._id, {
                ...idea.value,
                score: idea.value.score - 1
              })}
          >
            <Glyphicon glyph="thumbs-down" />
          </a>
        </span>
        <span style={{ marginRight: '10px' }}>
          <a
            href="#"
            onClick={() =>
              fun.vote(idea._id, {
                ...idea.value,
                score: idea.value.score + 1
              })}
          >
            <Glyphicon glyph="thumbs-up" />
          </a>
        </span>
        <Badge>{idea.value.score}</Badge>
      </div>
    </font>
    <b>{idea.value.title}</b>
    <div>
      {idea.value.content}
      {remove &&
        <font size={4}>
          <a href="#" onClick={() => fun.delete(idea._id)}>
            <Glyphicon glyph="scissors" style={{ float: 'right' }} />
          </a>
        </font>}
    </div>
  </ListGroupItem>
);

const IdeaList = ({ ideas, fun, remove }) =>
  ideas.length
    ? <div>
        <ListGroup className="item">
          <FlipMove duration={750} easing="ease-out">
            {ideas.sort((a, b) => b.value.score - a.value.score).map(idea => (
              <div key={idea._id}>
                <Idea {...{ idea, fun, remove, key: idea._id }} />
              </div>
            ))}
          </FlipMove>
        </ListGroup>
      </div>
    : <p><i>No ideas added yet</i></p>;

export default (
  {
    configData,
    object,
    userInfo,
    logger,
    reactiveFn,
    reactiveData,
    saveProduct
  }: ActivityRunnerT
) => {
  const socialStructure = object.socialStructures.find(x => x[userInfo.id]);
  const group = (socialStructure &&
    socialStructure[userInfo.id][configData.groupBy]) ||
    'default';

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
      logger({ key: 'group ' + group, type: 'idea' });
      reactiveFn(group).listAdd({ score: 0, ...e.formData });
      reactiveFn(group).keySet('DATA', {});
    }
  };

  if (object.products.length) {
    object.products[0].forEach(item => {
      const id = Stringify(item.data);
      reactiveFn(group).listAddNoClobber(id, item.data);
    });
  }

  return (
    <div>
      <b>Group: {group}</b>
      <Container>
        <ListContainer>
          <p>{configData.text}</p>
          <IdeaList
            ideas={reactiveData.list.filter(x => x.groupId === group)}
            fun={{
              vote: (id, item) => {
                logger({ key: userInfo.name, type: 'vote' });
                reactiveFn(group).listSet(id, item);
              },
              delete: reactiveFn(group).listDel
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
                      onClick={saveProduct(group, {
                        ideas: reactiveData.list.filter(
                          x => x.groupId === group
                        )
                      })}
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
