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
import { withState, compose } from 'recompose';

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

const Idea = ({
  children,
  delFn,
  dataFn,
  meta,
  vote,
  userInfo,
  editFn,
  zoomable,
  editable,
  zoomFn
}) => (
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
        {editable && (
          <A onClick={() => editFn(meta.id)}>
            <Glyphicon
              glyph="pencil"
              style={{
                float: 'right',
                marginRight: '10px'
              }}
            />
          </A>
        )}
        {zoomable && (
          <A onClick={() => zoomFn(meta.id)}>
            <Glyphicon
              glyph="zoom-in"
              style={{
                float: 'right',
                marginRight: '10px'
              }}
            />
          </A>
        )}
      </font>
    </div>
  </ListGroupItem>
);

const IdeaListRaw = ({
  data,
  dataFn,
  LearningItem,
  vote,
  userInfo,
  edit,
  setEdit,
  zoom,
  setZoom
}) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {data.map(x => {
          return (
            <div key={x}>
              <LearningItem
                type={edit === x ? 'edit' : zoom === x ? 'view' : 'viewThumb'}
                render={props => (
                  <Idea
                    {...props}
                    vote={vote}
                    delFn={e => dataFn.listDel(e, data.findIndex(y => y === e))}
                    editFn={e => {
                      setZoom(false);
                      setEdit(edit === e ? false : e);
                    }}
                    zoomFn={e => {
                      setEdit(false);
                      setZoom(zoom === e ? false : e);
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

const IdeaList = compose(
  withState('edit', 'setEdit', undefined),
  withState('zoom', 'setZoom', undefined)
)(IdeaListRaw);

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
  stream,
  LearningItem
}: ActivityRunnerT) => {
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
    <React.Fragment>
      <div className="bootstrap" style={{ width: '80%' }}>
        <Container>
          <ListContainer>
            <p>{activityData.config.text}</p>
            <IdeaList
              data={data}
              vote={vote}
              dataFn={dataFn}
              LearningItem={LearningItem}
              userInfo={userInfo}
            />
          </ListContainer>
        </Container>
      </div>
      <div style={{ display: 'flex' }}>
        <div style={{ width: '500px' }}>
          <LearningItem
            li="li-idea"
            type="create"
            meta={{ score: 0, students: {} }}
            onCreate={e => {
              dataFn.listAppend(e);
              stream(e);
            }}
          />
        </div>
        <LearningItem
          type="create"
          meta={{ score: 0, students: {} }}
          onCreate={e => {
            dataFn.listAppend(e);
            stream(e);
          }}
        />
      </div>
    </React.Fragment>
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
