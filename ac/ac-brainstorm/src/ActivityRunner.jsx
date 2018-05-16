// @flow

import * as React from 'react';
import { values, A, type ActivityRunnerPropsT } from 'frog-utils';
import styled from 'styled-components';
import FlipMove from '@houshuang/react-flip-move';
import { Badge, Glyphicon, ListGroup, ListGroupItem } from 'react-bootstrap';
import { withState, compose } from 'recompose';
import { sortBy } from 'lodash';

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
        <A onClick={() => vote(meta.id, -1)}>
          <Glyphicon
            style={{
              color: chooseColor(meta.students[userInfo.id], false),
              marginRight: '10px'
            }}
            glyph="thumbs-down"
          />
        </A>
        <A onClick={() => vote(meta.id, 1)}>
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
        <A onClick={() => delFn(meta)}>
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
  vote,
  userInfo,
  edit,
  setEdit,
  zoom,
  setZoom,
  LearningItem,
  history
}) => (
  <div>
    <ListGroup className="item">
      <FlipMove duration={750} easing="ease-out">
        {sortBy(values(data), x => [-x.score, x.id]).map(x => (
          <div key={x.li}>
            <LearningItem
              type={
                edit === x.id
                  ? 'edit'
                  : zoom === x.id
                    ? history
                      ? 'history'
                      : 'view'
                    : 'thumbView'
              }
              render={({ zoomable, editable, children }) => (
                <Idea
                  zoomable={zoomable || history}
                  editable={editable}
                  meta={x}
                  vote={vote}
                  delFn={item => dataFn.objDel(item, item.id)}
                  editFn={e => {
                    setZoom(false);
                    setEdit(edit === e ? false : e);
                  }}
                  zoomFn={e => {
                    setEdit(false);
                    setZoom(zoom === e ? false : e);
                  }}
                  userInfo={userInfo}
                >
                  {children}
                </Idea>
              )}
              id={x.li}
            />
          </div>
        ))}
      </FlipMove>
    </ListGroup>
  </div>
);

const IdeaList = compose(
  withState('edit', 'setEdit', undefined),
  withState('zoom', 'setZoom', undefined)
)(IdeaListRaw);

const ActivityRunner = ({
  userInfo,
  logger,
  activityData,
  data,
  dataFn
}: ActivityRunnerPropsT) => {
  const vote = (id, incr) => {
    logger({ type: 'vote', itemId: id, value: incr });
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

  const formBoolean = activityData.config.formBoolean;
  const LearningItem = dataFn.LearningItem;
  const slider = activityData.config.zoomShowsHistory;
  return (
    <React.Fragment>
      <div className="bootstrap" style={{ width: '80%' }}>
        <ListContainer>
          <p>{activityData.config.text}</p>
          <IdeaList
            data={data}
            vote={vote}
            dataFn={dataFn}
            userInfo={userInfo}
            LearningItem={LearningItem}
            history={slider}
          />
        </ListContainer>
      </div>
      {formBoolean && (
        <React.Fragment>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '500px' }}>
              <LearningItem
                liType="li-idea"
                type="create"
                meta={{ score: 0, students: {} }}
                autoInsert
              />
            </div>
            <LearningItem
              type="create"
              meta={{ score: 0, students: {} }}
              autoInsert
            />
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default ActivityRunner;
