// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { every } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import { CircularProgress } from 'material-ui/Progress';

import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Preview from './../Preview';
import TopBar from './TopBar';

const styles = {
  subroot: {
    overflow: 'hidden',
    height: '100%'
  }
};

const TeacherContainer = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return <CircularProgress />;
  }
  return (
    <div id="app">
      <Switch>
        <Route path="/graph/:graphId" component={GraphEditor} />
        <Route path="/graph" component={GraphEditor} />
        <Route component={WithTopBar} />
      </Switch>
    </div>
  );
};

const WithTopBar = () => (
  <React.Fragment>
    <TopBar />
    <div id="everything-except-top-bar" style={styles.subroot}>
      <Switch>
        <Route path="/teacher/:graphId" component={TeacherView} />
        <Route path="/teacher" component={TeacherView} />
        <Route path="/student" component={StudentView} />
        <Route path="/preview/:previewId" component={Preview} />
        <Route path="/preview" component={Preview} />
        <Route component={GraphEditor} />
      </Switch>
    </div>
  </React.Fragment>
);

export default withTracker(() => {
  const collections = [
    'activities',
    'connections',
    'graphs',
    'objects',
    'operators',
    'users',
    'products',
    'sessions',
    'globalSettings',
    'dashboardData'
  ];
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return { ready: every(subscriptions.map(x => x.ready()), Boolean) };
})(TeacherContainer);
