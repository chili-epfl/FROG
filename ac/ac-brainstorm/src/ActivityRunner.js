// @flow

import * as React from 'react';
import { values, ActivityRunnerPropsT } from 'frog-utils';
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
import { CardContent, CardActions, Button } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';

const styles = () => ({
  badge: {
    right: '1px',
    top: '1px'
  }
});

const AddingLI = ({ LearningItem, config }) => (
  <Card style={{ margin: 5, padding: 5 }} raised>
    <CardContent>
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
    </CardContent>
    <CardActions>
      {config.allowGeneralLI && (
        <LearningItem
          type="create"
          meta={{ score: 0, students: {} }}
          autoInsert
        />
      )}
    </CardActions>
  </Card>
);

class Idea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
  }
  handleOnFocus() {
    this.setState(() => ({ focus: true }));
  }
  handleOnBlur() {
    setTimeout(() => {
      this.setState(() => ({ focus: false }));
    }, 0);
  }
  render() {
    const {
      vote,
      meta,
      editFn,
      delFn,
      zoomable,
      config,
      editable,
      children
    } = this.props;
    return (
      <Card
        raised
        onMouseLeave={this.handleOnBlur}
        onMouseEnter={this.handleOnFocus}
      >
        <CardContent
          style={{
            minWidth: '400px'
          }}
        >
          <Grow in={this.state.focus}>
            <div
              style={{
                position: 'absolute',
                zIndex: 2,
                minWidth: '108px',
                display: 'flex',
                flexDirection: 'row',
                bottom: '15px',
                right: '15px'
              }}
            >
              {config.allowVoting && (
                <div>
                  <Button size="small" onClick={() => vote(meta.id, -1)}>
                    <ThumbDownIcon fontSize="small" />
                  </Button>
                  <Button size="small" onClick={() => vote(meta.id, 1)}>
                    <ThumbUpIcon fontSize="small" />
                  </Button>
                </div>
              )}
              <div>
                <font size={4}>
                  {config.allowDelete && (
                    <Button size="small" onClick={() => delFn(meta)}>
                      <DeleteIcon fontSize="small" />
                    </Button>
                  )}
                  {editable &&
                    config.allowEdit && (
                      <Button size="small" onClick={() => editFn(meta.id)}>
                        <PencilIcon fontSize="small" />
                      </Button>
                    )}
                  {zoomable &&
                    !config.expandItems && (
                      <Button size="small" onClick={() => zoomFn(meta.id)}>
                        <ZoomInIcon glyph="zoom-in" fontSize="small" />
                      </Button>
                    )}
                </font>
              </div>
            </div>
          </Grow>
          {children}
        </CardContent>
      </Card>
    );
  }
}

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
              style={{ display: 'block' }}
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
        <Grid container direction="row">
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
