// @flow
import * as React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { every } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import Spinner from 'react-spinner';

import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Preview from './../Preview';
import Admin from './../Admin';
import TopBar from './TopBar';

const TeacherContainer = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return <Spinner />;
  }
  return (
    <div id="app">
      <Switch>
        <Route path="/preview/:activityTypeId/:example" component={Preview} />
        <Route path="/preview/:activityTypeId" component={Preview} />
        <Route path="/graph/:graphId" component={GraphEditor} />
        <Route path="/graph" component={GraphEditor} />
        <Route component={WithTopBar} />
      </Switch>
    </div>
  );
};

const WithTopBar = () => (
  <div>
    <TopBar />
    <Switch>
      <Route path="/teacher/:graphId" component={TeacherView} />
      <Route path="/teacher" component={TeacherView} />
      <Route path="/student" component={StudentView} />
      <Route path="/admin" component={Admin} />
      <Route path="/preview" component={Preview} />
      <Route component={GraphEditor} />
    </Switch>
  </div>
);

export default createContainer(() => {
  const collections = [
    'activities',
    'activity_data',
    'connections',
    'graphs',
    'objects',
    'operators',
    'products',
    'sessions',
    'users'
  ];
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return { ready: every(subscriptions.map(x => x.ready()), Boolean) };
}, TeacherContainer);
