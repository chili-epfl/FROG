// @flow

import * as React from 'react';
import { uuid, A } from 'frog-utils';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
import FlipMove from '@houshuang/react-flip-move';
import {
  Badge,
  Glyphicon,
  Button,
  ListGroup,
  ListGroupItem
} from 'react-bootstrap';
import { withState } from 'recompose';

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

const Idea = ({ children, delFn, dataFn, meta, vote, userInfo, editFn }) => (
  <ListGroupItem>
    <font size={4}>
      <div style={{ float: 'right' }}>
        <A onClick={() => vote(-1, meta, dataFn)}>
          <Glyphicon
            style={{
              color: chooseColor(meta.students[userInfo.id], false),
              marginRight: '10px'
            }}
            glyph="thumbs-down"
          />
        </A>
        <A onClick={() => vote(1, meta, dataFn)}>
          <Glyphicon
            style={{
              color: chooseColor(meta.students[userInfo.id], true),
              marginRight: '10px'
            }}
            glyph="thumbs-up"
          />
        </A>
        <Badge>{meta.score}</Badge>
      </div>
    </font>
    {children}
    <div style={{ position: 'relative', top: '-15px' }}>
      <font size={4}>
        <A onClick={() => delFn(meta.id)}>
          <Glyphicon
            glyph="scissors"
            style={{
              float: 'right',
              marginRight: '10px'
            }}
          />
        </A>
        <A onClick={() => editFn(meta.id)}>
          <Glyphicon
            glyph="pencil"
            style={{
              float: 'right',
              marginRight: '10px'
            }}
          />
        </A>
      </font>
    </div>
  </ListGroupItem>
);

const IdeaList = ({
  data,
  dataFn,
  LearningItem,
  vote,
  userInfo,
  edit,
  setEdit
}) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {data.map(x => {
          return (
            <div key={x}>
              <LearningItem
                type={edit === x ? 'edit' : 'view'}
                render={props => (
                  <Idea
                    {...props}
                    vote={vote}
                    delFn={e => dataFn.listDel(e, data.findIndex(y => y === e))}
                    editFn={e => {
                      if (edit === e) {
                        setEdit(undefined);
                      } else {
                        setEdit(e);
                      }
                    }}
                    userInfo={userInfo}
                  />
                )}
                key={x}
                id={x}
              />
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
  dataFn,
  LearningItem,
  edit,
  setEdit
}: ActivityRunnerT & { edit?: string, setEdit: Function }) => {
  const onSubmit = e => {
    if (e.formData && e.formData.title && e.formData.content) {
      const id = uuid();
      logger({
        type: 'idea',
        itemId: id,
        value: e.formData.title + '\n' + e.formData.content
      });
      dataFn.listAppendLI(
        'li-idea',
        {
          title: e.formData.title,
          content: e.formData.content
        },
        { score: 0, students: {} }
      );
    }
  };

  const vote = (incr, specdata, specdataFn) => {
    logger({ type: 'vote', itemId: specdata.id, value: incr });
    switch (specdata.students[userInfo.id]) {
      case -1:
        if (incr < 0) {
          specdataFn.objInsert(0, ['students', userInfo.id]);
          specdataFn.numIncr(1, ['score']);
        } else {
          specdataFn.objInsert(1, ['students', userInfo.id]);
          specdataFn.numIncr(2, ['score']);
        }
        break;
      case 1:
        if (incr < 0) {
          specdataFn.objInsert(-1, ['students', userInfo.id]);
          specdataFn.numIncr(-2, ['score']);
        } else {
          specdataFn.objInsert(0, ['students', userInfo.id]);
          specdataFn.numIncr(-1, ['score']);
        }
        break;
      default:
        specdataFn.objInsert(incr, ['students', userInfo.id]);
        specdataFn.numIncr(incr, ['score']);
    }
  };

  const formBoolean = activityData.config.formBoolean;
  return (
    <div className="bootstrap">
      <Container>
        <ListContainer>
          <p>{activityData.config.text}</p>
          <IdeaList
            data={data}
            edit={edit}
            setEdit={setEdit}
            vote={vote}
            dataFn={dataFn}
            LearningItem={LearningItem}
            userInfo={userInfo}
          />
        </ListContainer>
      </Container>
      {formBoolean && <AddIdea onSubmit={onSubmit} />}
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

export default withState('edit', 'setEdit', undefined)(ActivityRunner);
