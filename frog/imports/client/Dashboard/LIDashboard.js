// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { SearchField } from 'frog-utils';
import {
  Paper,
  Button,
  Menu,
  MenuItem,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Switch,
  IconButton
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import Stringify from 'json-stringify-pretty-compact';
import ReactTooltip from 'react-tooltip';
import Dialog from '@material-ui/core/Dialog';

import { learningItemTypesObj } from '/imports/activityTypes';
import { Activities } from '/imports/api/activities';
import { Sessions } from '/imports/api/sessions';
import LI from '/imports/client/LearningItem';
import { connection } from '../App/connection';

const doc = connection.get('li', 'displayLI');
const dataFn = generateReactiveFn(doc, LI);
const LearningItem = dataFn.LearningItem;

const styles = () => ({
  dashboardContainer: {
    position: 'relative',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  zoomViewContainer: {
    position: 'relative',
    zIndex: 1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#2228',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  zoomViewInfo: { position: 'absolute', bottom: '0px' },
  closeZoom: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#fff0'
  },
  liZoomContainer: {
    maxHeight: 'calc(100% - 200px)',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  liRoot: {
    zIndex: 2,
    width: '100%',
    height: '100%',
    maxWidth: '600px',
    display: 'flex',
    flexDirection: 'column'
  },
  liList: {
    columnWidth: '200px'
  },
  paper: {
    width: '750px',
    height: '1000px'
  },
  liBox: {
    display: 'inline-block',
    width: '300px',
    margin: '5px',
    padding: '5px',
    overflow: 'auto'
  },
  masonry: {
    columnWidth: '300px'
  }
});

class MyMenu extends React.Component<any, any> {
  state = { open: false };

  render() {
    return (
      <React.Fragment>
        <Button
          variant="outlined"
          onClick={e => this.setState({ open: e.currentTarget })}
        >
          {this.props.title}
        </Button>
        {this.state.open && (
          <Menu open={!!this.state.open} anchorEl={this.state.open}>
            {this.props.choices.map(x => (
              <MenuItem
                key={x.key}
                onClick={() => {
                  this.setState({ open: null });
                  x.onClick();
                }}
              >
                {x.title}
              </MenuItem>
            ))}
          </Menu>
        )}
      </React.Fragment>
    );
  }
}

class Dashboard extends React.Component<any, any> {
  subscription: any;

  constructor(props: *) {
    super(props);

    this.state = {
      results: [],
      search: '',
      filter: props.activityId,
      filterTitle: undefined
    };
  }

  componentDidMount() {
    const query = this.props.wikiId
      ? { wikiId: this.props.wikiId, deleted: { $ne: true } }
      : this.props.sessionId
      ? { sessionId: this.props.sessionId, draft: { $ne: true } }
      : { _id: this.props.id };
    this.subscription = connection.createSubscribeQuery(
      'li',
      query,
      {},
      (err, results) =>
        this.setState({ results: results.map(x => ({ ...x.data, id: x.id })) })
    );
    this.subscription.on('changed', e =>
      this.setState({ results: e.map(x => ({ ...x.data, id: x.id })) })
    );
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.destroy();
    }
  }

  render() {
    const { classes } = this.props;

    let res = this.state.results;
    if (this.state.filter) {
      res = this.state.results.filter(
        x => x.createdInActivity === this.state.filter
      );
    }
    const graphId =
      this.props.sessionId && Sessions.findOne(this.props.sessionId).graphId;
    return (
      <div className={classes.dashboardContainer}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row'
          }}
        >
          {this.props.sessionId && (
            <MyMenu
              style={{ alignSelf: 'flex-start' }}
              title={this.state.filterTitle || 'All activities'}
              choices={[
                {
                  title: 'All activities',
                  key: 'all',
                  onClick: () =>
                    this.setState({
                      filter: undefined,
                      filterTitle: undefined
                    })
                },
                ...Activities.find({ graphId })
                  .fetch()
                  .map(x => ({
                    title: x.title,
                    key: x._id,
                    onClick: () =>
                      this.setState({ filter: x._id, filterTitle: x.title })
                  }))
              ]}
            />
          )}
          <div style={{ position: 'absolute', left: '50%' }}>
            <SearchField
              classes={{}}
              onChange={e => {
                this.setState({ search: e.toLowerCase() });
              }}
            />
          </div>
          <div style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
            Expand
            <Switch
              checked={this.state.expand}
              onChange={() => this.setState({ expand: !this.state.expand })}
            />
          </div>
        </div>
        <div className={classes.masonry}>
          {res.map(liObj => {
            return (
              <LearningItem
                search={this.state.search}
                key={liObj.id}
                type={this.state.expand ? 'view' : 'thumbView'}
                id={liObj.id}
                notEmpty
                render={props => (
                  <Paper
                    elevation={12}
                    className={classes.liBox}
                    onClick={() =>
                      this.props.onClick
                        ? this.props.onClick(liObj.id)
                        : !this.state.expand &&
                          this.setState({ zoom: liObj.id })
                    }
                  >
                    {props.children}
                  </Paper>
                )}
              />
            );
          })}
        </div>
        {this.state.zoom && (
          <ZoomView
            id={this.state.zoom}
            close={() => this.setState({ zoom: undefined })}
          />
        )}
      </div>
    );
  }
}

const ZoomViewInfoTable = props => (
  <>
    <Table>
      <TableBody>
        <TableRow>
          <TableCell>Learning Item Type</TableCell>
          <TableCell>{learningItemTypesObj[props.liType].name}</TableCell>
          <TableCell>Created by</TableCell>
          <TableCell>
            {Meteor.users.findOne(props.data.createdByUser)?.username}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Created by group</TableCell>
          <TableCell>{JSON.stringify(props.data.createdByInstance)}</TableCell>
          <TableCell>Created in activity</TableCell>
          <TableCell>
            {Activities.findOne(props.data.createdInActivity)?.title}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Created at</TableCell>
          <TableCell>{props.data.createdAt || ''}</TableCell>

          <TableCell>Raw data</TableCell>

          <TableCell
            data-tip={Stringify(props.data).replace(/\n/gi, '<br>')}
            style={{ width: '50px' }}
          >
            Mouse over
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
    <ReactTooltip multiline />
  </>
);

class ZoomViewRaw extends React.Component<*, *> {
  state = { history: false };

  render() {
    const { close, id, classes } = this.props;
    return (
      <Dialog open onClose={close} classes={{ paper: classes.paper }}>
        <div className={classes.zoomViewContainer}>
          <div onClick={close} className={classes.closeZoom} />
          <Paper className={classes.liRoot} elevation={8}>
            <div style={{ display: 'flex' }}>
              <div style={{ alignSelf: 'flex-start', marginRight: 'auto' }}>
                Scrub history
                <Switch
                  checked={this.state.history}
                  onChange={() =>
                    this.setState({ history: !this.state.history })
                  }
                />
              </div>

              <div style={{ alignSelf: 'flex-end', marginLeft: 'auto' }}>
                <IconButton color="inherit" onClick={close} aria-label="Close">
                  <CloseIcon />
                </IconButton>
              </div>
            </div>
            <LearningItem
              id={id}
              type={this.state.history ? 'history' : 'view'}
              render={props => (
                <>
                  <div
                    style={{ position: 'absolute', top: '15px', left: '50%' }}
                  >
                    {learningItemTypesObj[props.data.liType].name}
                  </div>
                  <div className={classes.liZoomContainer}>
                    <Paper style={{ margin: '5px' }} elevation={24}>
                      {props.children}
                    </Paper>
                  </div>
                  <div className={classes.zoomViewInfo}>
                    <ZoomViewInfoTable {...props} />
                  </div>
                </>
              )}
            />
          </Paper>
        </div>
      </Dialog>
    );
  }
}

const ZoomView = withStyles(styles)(ZoomViewRaw);

export default withStyles(styles)(Dashboard);
