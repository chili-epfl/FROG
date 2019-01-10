// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import {
  Paper,
  Tooltip,
  TextField,
  Button,
  Menu,
  MenuItem,
  Table,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';

import { learningItemTypesObj } from '/imports/activityTypes';
import { Activities } from '/imports/api/activities';
import { Sessions } from '/imports/api/sessions';
import LI from '/imports/client/LearningItem';
import ImageBox from './ImageBox';
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
    position: 'absolute',
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
  closeZoom: {
    position: 'absolute',
    zIndex: 0,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: '#fff0'
  },
  liRoot: {
    zIndex: 2,
    position: 'relative',
    width: '600px',
    maxHeight: '600px',
    display: 'flex',
    flexDirection: 'column'
  },
  liList: {
    flex: 1,
    position: 'relative',
    overflow: 'auto'
  }
});

class MyMenu extends React.Component<any, any> {
  state = { open: false };

  render() {
    return (
      <React.Fragment>
        <Button onClick={e => this.setState({ open: e.currentTarget })}>
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
    const query = this.props.sessionId
      ? { sessionId: this.props.sessionId, draft: { $ne: true } }
      : { _id: this.props.id };
    const subscription = connection.createSubscribeQuery(
      'li',
      query,
      {},
      (err, results) =>
        this.setState({ results: results.map(x => ({ ...x.data, id: x.id })) })
    );
    subscription.on('changed', e =>
      this.setState({ results: e.map(x => ({ ...x.data, id: x.id })) })
    );
  }

  render() {
    const { classes } = this.props;

    let res = this.state.results;
    if (this.state.filter) {
      res = this.state.results.filter(
        x => x.createdInActivity === this.state.filter
      );
    }
    if (this.state.search.trim() !== '') {
      res = res.filter(x =>
        JSON.stringify(x.payload).includes(this.state.search.trim())
      );
    }
    const graphId =
      this.props.sessionId && Sessions.findOne(this.props.sessionId).graphId;
    return (
      <div className={classes.dashboardContainer}>
        {this.props.sessionId && (
          <div>
            <MyMenu
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
            <TextField
              id="name"
              label="Search"
              onChange={e => this.setState({ search: e.target.value })}
              margin="normal"
            />
          </div>
        )}
        <div className={classes.liList}>
          {res.map(x => (
            <Tooltip key={x.id} id={'tooltip' + x.id} title="Hi">
              <ImageBox
                key={x.id}
                onClick={() => this.setState({ zoom: x.id })}
              >
                <LearningItem type="thumbView" id={x.id} />
              </ImageBox>
            </Tooltip>
          ))}
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
      </TableRow>
    </TableBody>
  </Table>
);

const ZoomViewRaw = ({ close, id, classes }: Object) => (
  <div className={classes.zoomViewContainer}>
    <div onClick={close} className={classes.closeZoom} />
    <LearningItem
      id={id}
      type="history"
      render={props => (
        <Paper className={classes.liRoot} elevation={8}>
          <div style={{ flex: 1, overflow: 'auto' }}>{props.children}</div>
          <ZoomViewInfoTable {...props} />
        </Paper>
      )}
    />
  </div>
);

const ZoomView = withStyles(styles)(ZoomViewRaw);

export default withStyles(styles)(Dashboard);
