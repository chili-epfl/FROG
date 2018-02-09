// @flow

import * as React from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import List, { ListItem, ListSubheader, ListItemText } from 'material-ui/List';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';

import { Sessions } from '../api/sessions';
import {
  Activities,
  Operators,
  Connections,
  importActivity,
  importOperator,
  importConnection,
  deleteDatabase
} from '../api/activities';
import { Graphs, importGraph } from '../api/graphs';

import { mixedJigsaw } from '../datasets/mixedJigsaw';
import { argueGraph } from '../datasets/argueGraph';

const loadDatabase = data => {
  data.graphs.forEach(item => importGraph(item));
  data.activities.forEach(item => importActivity(item));
  data.operators.forEach(item => importOperator(item));
  data.connections.forEach(item => importConnection(item));
};

type StateT = {
  isClicked: boolean
};

class DisplayData extends React.Component<Object, StateT> {
  constructor(props) {
    super(props);
    this.state = { isClicked: false };
  }

  toggleDisplay = () => {
    this.setState({ isClicked: !this.state.isClicked });
  };

  render() {
    const listStyle = {
      jsonFont: {
        fontSize: '0.75rem',
        fontWeight: 400,
        fontFamily: 'monospace',
        display: 'block'
      }
    };
    return (
      <List subheader={<ListSubheader>{this.props.title}</ListSubheader>}>
        {this.props.data.map(d => (
          <ListItem key={d._id} dense button onClick={this.toggleDisplay}>
            <ListItemText primary={d._id} />
            {this.state.isClicked ? (
              <Typography type="caption" style={listStyle.jsonFont}>
                {JSON.stringify(d, null, 2)}
              </Typography>
            ) : null}
          </ListItem>
        ))}
      </List>
    );
  }
}

const styles = {
  sheet: {
    overflowX: 'hidden'
  },
  root: {
    flexGrow: 1
  }
};
export default createContainer(
  () => {
    const sessions = Sessions.find().fetch();
    const graphs = Graphs.find().fetch();
    const activities = Activities.find().fetch();
    const operators = Operators.find().fetch();
    const connections = Connections.find().fetch();
    return { sessions, graphs, activities, operators, connections };
  },
  ({ sessions, graphs, activities, operators, connections }) => (
    <div id="admin" style={styles.sheet}>
      <Grid container justify="center" spacing={40}>
        <Grid item xs>
          <List subheader={<ListSubheader>Commands</ListSubheader>}>
            <ListItem dense button onClick={() => deleteDatabase()}>
              <ListItemText primary="DELETE DATABASE" />
            </ListItem>
            <ListItem dense button onClick={() => loadDatabase(argueGraph)}>
              <ListItemText primary="LOAD argueGraph" />
            </ListItem>
            <ListItem dense button onClick={() => loadDatabase(mixedJigsaw)}>
              <ListItemText primary="LOAD mixedJigsaw" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs>
          <DisplayData data={graphs} title="Graphs" />
        </Grid>
        <Grid item xs>
          <DisplayData data={activities} title="Activities" />
        </Grid>
      </Grid>
      <Grid container justify="center" spacing={40}>
        <Grid item xs>
          <DisplayData data={operators} title="Operators" />
        </Grid>
        <Grid item xs>
          <DisplayData data={connections} title="Connections" />
        </Grid>
        <Grid item xs>
          <DisplayData data={sessions} title="Sessions" />
        </Grid>
      </Grid>
    </div>
  )
);
