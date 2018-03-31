// @flow

import * as React from 'react';
import { uuid, A } from 'frog-utils';
import styled from 'styled-components';
import Form from 'react-jsonschema-form';
import FlipMove from '@houshuang/react-flip-move';
import { omit } from 'lodash';
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

const Idea = ({ children, delFn, dataFn, meta, vote, userInfo }) => (
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
    <div>
      {children}
      <font size={4}>
        <A onClick={() => delFn(meta.id)}>
          <Glyphicon glyph="scissors" style={{ float: 'right' }} />
        </A>
      </font>
    </div>
  </ListGroupItem>
);

const IdeaList = ({ data, dataFn, HOC, vote, userInfo }) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {data.map(x => (
          <div key={x}>
            <LearningItem
              render={props => (
                <Idea
                  {...props}
                  vote={vote}
                  delFn={e => {
                    console.log(e, data);
                    dataFn.listDel(e, data.findIndex(x => x === e));
                  }}
                  userInfo={userInfo}
                />
              )}
              HOC={HOC}
              key={x}
              id={x}
            />
          </div>
        ))}
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

const IdeaLI = ({ data }) => {
  return (
    <p>
      <b>{data.title}</b>
      <br />
      {data.content}
    </p>
  );
};

const learningItemTypesObj = { 'li-idea': IdeaLI };

const RenderLearningItem = ({ data, dataFn, render }) => {
  const Component = learningItemTypesObj[data.liType];
  if (!Component) {
    return <b>Unsupported learning item type {JSON.stringify(data.liType)}</b>;
  } else {
    if (render) {
      return render({
        meta: { id: dataFn.doc.id, ...omit(data, 'payload') },
        dataFn,
        children: <Component data={data.payload} />
      });
    } else {
      return <Component data={data.payload} />;
    }
  }
};

const LearningItem = ({ HOC, id, render }) => {
  const ToRun = HOC(id, undefined, undefined, undefined, 'li')(
    RenderLearningItem
  );
  return <ToRun render={render} />;
};

const ActivityRunner = ({
  userInfo,
  logger,
  activityData,
  data,
  dataFn,
  HOC
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

  const del = item => dataFn.objDel(item, item.id);
  const formBoolean = activityData.config.formBoolean;
  const fun = { vote, del, formBoolean };
  return (
    <div className="bootstrap">
      <Container>
        <ListContainer>
          <p>{activityData.config.text}</p>
          <IdeaList
            data={data}
            vote={vote}
            dataFn={dataFn}
            HOC={HOC}
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

export default ActivityRunner;
