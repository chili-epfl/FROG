// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { every } from 'lodash';
import { Route, Switch } from 'react-router-dom';
import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Preview from './../Preview';
import Admin from './../Admin';
import TopBar from './TopBar';

const TeacherContainer = ({ ready }: { ready: boolean }) => {
  if (!ready) {
    return <img src="/images/Spinner.gif" alt="" />;
  }
  return (
    <div id="app">
      <TopBar />
      <Switch>
        <Route path="/graph/:graphId" component={GraphEditor} />
        <Route path="/graph" component={GraphEditor} />
        <Route path="/teacher/:graphId" component={TeacherView} />
        <Route path="/teacher" component={TeacherView} />
        <Route path="/student" component={StudentView} />
        <Route path="/admin" component={Admin} />
        <Route path="/preview/:activityTypeId/:example" component={Preview} />
        <Route path="/preview/:activityTypeId" component={Preview} />
        <Route path="/preview" component={Preview} />
        <Route component={GraphEditor} />
      </Switch>
    </div>
  );
};

export default createContainer(() => {
  const collections = [
    'activities',
    'activity_data',
    'connections',
    'graphs',
    'objects',
    'openUploads',
    'operators',
    'products',
    'sessions',
    'uploads'
  ];
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return { ready: every(subscriptions.map(x => x.ready()), Boolean) };
}, TeacherContainer);
