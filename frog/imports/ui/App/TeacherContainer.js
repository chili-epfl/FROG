// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { every } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

import { ExternalOperators } from '../../api/operators';
import { operatorTypesObj, operatorTypes } from '../../operatorTypes';
import TeacherView from '../TeacherView';
import GraphEditor from '../GraphEditor';
import Preview from '../Preview';
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
        <Route path="/teacher/graph/:graphId" component={GraphEditor} />
        <Route path="/teacher/graph" component={GraphEditor} />
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
        <Route path="/teacher/preview/:previewId" component={Preview} />
        <Route path="/teacher/preview" component={Preview} />
        <Route path="/teacher/orchestration/:graphId" component={TeacherView} />
        <Route path="/teacher/orchestration" component={TeacherView} />
        <Route path="/teacher/graph/:graphId" component={GraphEditor} />
        <Route path="/teacher/graph" component={GraphEditor} />
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
    'dashboardData',
    'externalOperators'
  ];

  if (!Meteor.user().role) {
    Meteor.call('make.teacher', Meteor.userId());
  }

  const subscriptions = collections.map(x => Meteor.subscribe(x));
  const extOp = ExternalOperators.find({}).fetch();
  extOp.forEach(ext => {
    if (!operatorTypes.includes(ext)) {
      operatorTypes.push(ext);
    }
    operatorTypesObj[ext.id] = ext;
  });

  return { ready: every(subscriptions.map(x => x.ready()), Boolean) };
})(TeacherContainer);
