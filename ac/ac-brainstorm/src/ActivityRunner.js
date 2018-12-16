// @flow

import * as React from 'react';
import { values, A, ActivityRunnerPropsT } from 'frog-utils';
import FlipMove from '@houshuang/react-flip-move';
import Badge from '@material-ui/core/Badge';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import ThumbDownIcon from '@material-ui/icons/ThumbDown';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import PencilIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { withStyles } from '@material-ui/core/styles';
import { withState, compose } from 'recompose';
import { orderBy } from 'lodash';
import { CardContent, CardActions } from '@material-ui/core';

const styles = () => ({
  badge: {
    right: '1px',
    top: '1px'
  }
});

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

const AddingLI = ({ LearningItem, config }) => (
  <>
    <div style={{ display: 'flex' }}>
      <div style={{ width: '500px' }}>
        {config.specificLI && (
          <LearningItem
            liType={config.liType || 'li-idea'}
            type="create"
            meta={{ score: 0, students: {} }}
            autoInsert
          />
        )}
      </div>
      {config.allowGeneralLI && (
        <LearningItem
          type="create"
          meta={{ score: 0, students: {} }}
          autoInsert
        />
      )}
    </div>
  </>
);

const Idea = ({
  children,
  delFn,
  meta,
  vote,
  userInfo,
  editFn,
  zoomable,
  editable,
  zoomFn,
  config
}) => (
  <Card style={{ minWidth: 400 }}>
    <CardContent>{children}</CardContent>
    <CardActions>
      {config.allowVoting && (
        <div>
          <A onClick={() => vote(meta.id, -1)}>
            <ThumbDownIcon
              style={{
                color: chooseColor(meta.students[userInfo.id], false),
                marginRight: '10px'
              }}
            />
          </A>
          <A onClick={() => vote(meta.id, 1)}>
            <ThumbUpIcon
              style={{
                color: chooseColor(meta.students[userInfo.id], true),
                marginRight: '10px'
              }}
            />
          </A>
        </div>
      )}
      <div>
        <font size={4}>
          {config.allowDelete && (
            <A onClick={() => delFn(meta)}>
              <DeleteIcon
                style={{
                  float: 'right',
                  color: 'grey',
                  marginRight: '10px'
                }}
              />
            </A>
          )}
          {editable && config.allowEdit && (
            <A onClick={() => editFn(meta.id)}>
              <PencilIcon
                style={{
                  float: 'right',
                  marginRight: '10px'
                }}
              />
            </A>
          )}
          {zoomable && !config.expandItems && (
            <A onClick={() => zoomFn(meta.id)}>
              <ZoomInIcon
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
    </CardActions>
  </Card>
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
  history,
  config,
  classes
}) => (
  <div>
    <List className="item">
      <FlipMove duration={750} easing="ease-out">
        {orderBy(values(data), x => parseInt(x.score, 10), ['desc']).map(x => (
          <div
            key={x.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #DDDDDD',
              borderRadius: '5px'
            }}
          >
            <Badge
              badgeContent={x.score}
              color="primary"
              classes={{ badge: classes.badge }}
            >
              <LearningItem
                type={
                  edit === x.id
                    ? 'edit'
                    : zoom === x.id
                    ? history
                      ? 'history'
                      : 'view'
                    : config.expandItems
                    ? 'view'
                    : 'thumbView'
                }
                render={({ zoomable, editable, children }) => (
                  <Idea
                    zoomable={zoomable || history}
                    editable={editable}
                    config={config}
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
            </Badge>
          </div>
        ))}
      </FlipMove>
    </List>
  </div>
);

const IdeaList = compose(
  withState('edit', 'setEdit', undefined),
  withState('zoom', 'setZoom', undefined)
)(withStyles(styles)(IdeaListRaw));

const ListComponent = ({
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

  const LearningItem = dataFn.LearningItem;
  const slider = activityData.config.zoomShowsHistory;
  return (
    <>
      <div style={{ width: '80%' }}>
        <Grid container>
          <p>{activityData.config.text}</p>
          <IdeaList
            config={activityData.config}
            data={data}
            vote={vote}
            dataFn={dataFn}
            userInfo={userInfo}
            LearningItem={LearningItem}
            history={slider}
          />
        </Grid>
      </div>
    </>
  );
};

const ActivityRunner = (props: ActivityRunnerPropsT) => (
  <div>
    <ListComponent {...props} />
    {props.activityData.config.allowCreate && (
      <AddingLI
        LearningItem={props.dataFn.LearningItem}
        config={props.activityData.config}
      />
    )}
  </div>
);

export default ActivityRunner;
