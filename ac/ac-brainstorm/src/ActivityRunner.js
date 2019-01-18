// @flow

import * as React from 'react';
import { values, type ActivityRunnerPropsT } from 'frog-utils';
import FlipMove from 'react-flip-move';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import Card from '@material-ui/core/Card';
import Chip from '@material-ui/core/Chip';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import PencilIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import DeleteIcon from '@material-ui/icons/Delete';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import { withStyles } from '@material-ui/core/styles';
import { withState, compose } from 'recompose';
import { orderBy } from 'lodash';
import { IconButton, CardContent, CardActions } from '@material-ui/core';
import Grow from '@material-ui/core/Grow';

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

class Idea extends React.Component<
  {
    vote: Function,
    meta: any,
    editFn: Function,
    delFn: Function,
    zoomable: boolean,
    zoomFn: Function,
    config: any,
    userInfo: Object,
    editable: boolean,
    edit: boolean,
    children: any
  },
  { focus: boolean }
> {
  constructor(props) {
    super(props);
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.state = {
      focus: props.edit
    };
  }

  handleOnFocus = () => {
    this.setState(() => ({ focus: true }));
  };

  handleOnBlur = () => {
    this.setState(() => ({ focus: false }));
  };

  render() {
    const {
      vote,
      userInfo,
      meta,
      editFn,
      delFn,
      zoomFn,
      zoomable,
      config,
      editable,
      edit,
      children
    } = this.props;
    const { focus } = this.state;
    const { score } = meta;
    const showMouseover =
      config.allowDelete ||
      (editable && config.allowEdit) ||
      (zoomable && !config.expandItems && config.allowZoom);
    return (
      <Card
        raised={focus}
        onMouseLeave={this.handleOnBlur}
        onMouseOver={() => {
          if (!focus) {
            this.handleOnFocus();
          }
        }}
        onMouseEnter={this.handleOnFocus}
        style={{
          position: 'relative',
          minWidth: '400px',
          padding: '5px',
          minHeight: (showMouseover ? 40 : 0) + 20 + 'px'
        }}
      >
        <div
          style={{
            position: 'absolute',
            zIndex: 2,
            minWidth: '108px',
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'row',
            bottom: '0px',
            right: '10px'
          }}
        >
          {showMouseover && focus && (
            <div style={{ width: '100%/' }}>
              <font size={4}>
                {config.allowDelete && (
                  <IconButton size="small" onClick={() => delFn(meta)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
                {editable && config.allowEdit && (
                  <IconButton
                    style={{ leftMargin: '10px' }}
                    size="small"
                    onClick={() => {
                      editFn(meta.id);
                      window.setTimeout(() => this.setState({ focus: true }));
                    }}
                  >
                    {edit ? (
                      <SaveIcon fontSize="small" />
                    ) : (
                      <PencilIcon fontSize="small" />
                    )}
                  </IconButton>
                )}
                {zoomable && !config.expandItems && config.allowZoom && (
                  <IconButton
                    style={{ leftMargin: '10px' }}
                    size="small"
                    onClick={() => {
                      zoomFn(meta.id);
                      window.setTimeout(() => this.setState({ focus: true }));
                    }}
                  >
                    <ZoomInIcon glyph="zoom-in" fontSize="small" />
                  </IconButton>
                )}
              </font>
            </div>
          )}
        </div>

        <div
          style={{
            position: 'absolute',
            display: 'flex',
            flexDirection: 'row',
            top: '2px',
            right: '5px'
          }}
        >
          {config.allowVoting && (
            <IconButton
              disableTouchRipple
              disableRipple
              size="small"
              onClick={() => vote(meta.id, 1)}
              style={{
                minHeight: '13px',
                padding: '3px 4px'
              }}
            >
              <KeyboardArrowUp
                style={{
                  color: chooseColor(meta.students[userInfo.id], true)
                }}
                fontSize="small"
              />
            </IconButton>
          )}
          <Chip
            label={score}
            style={{
              height: 'unset'
            }}
          />
          {config.allowVoting && (
            <IconButton
              disableTouchRipple
              disableRipple
              size="small"
              onClick={() => vote(meta.id, -1)}
              style={{
                minHeight: '13px',
                padding: '3px 4px'
              }}
            >
              <KeyboardArrowDown
                style={{
                  color: chooseColor(meta.students[userInfo.id], false)
                }}
                fontSize="small"
              />
            </IconButton>
          )}
        </div>
        <div style={{ width: 'calc(100% - 85px)', overflow: 'hidden' }}>
          {children}
          {showMouseover && <div style={{ height: '25px' }} />}
        </div>
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
  config
}) => (
  <>
    <List style={{ width: '100%' }}>
      <FlipMove duration={750} easing="ease-out">
        {(config.sort
          ? orderBy(values(data), x => parseInt(x.score, 10), ['desc'])
          : values(data)
        ).map(x => (
          <div key={x.id}>
            <LearningItem
              id={x.li}
              notEmpty
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '5px',
                    padding: '5px'
                  }}
                >
                  <Idea
                    edit={edit === x.id}
                    zoomable={zoomable || history}
                    editable={editable}
                    config={config}
                    meta={x}
                    vote={vote}
                    userInfo={userInfo}
                    delFn={item => dataFn.objDel(item, item.id)}
                    editFn={e => {
                      setZoom(false);
                      setEdit(edit === e ? false : e);
                    }}
                    zoomFn={e => {
                      setEdit(false);
                      setZoom(zoom === e ? false : e);
                    }}
                  >
                    {children}
                  </Idea>
                </div>
              )}
            />
          </div>
        ))}
      </FlipMove>
    </List>
  </>
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
      <div style={{ width: '100%' }}>
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
