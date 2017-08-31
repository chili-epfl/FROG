// @flow
import React from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import { toObject as queryToObject } from 'query-parse';
import { every } from 'lodash';
import { Redirect, Route, Switch } from 'react-router-dom';
import StudentView from './../StudentView';
import TeacherView from './../TeacherView';
import GraphEditor from './../GraphEditor';
import Preview from './../Preview';
import Admin from './../Admin';
import TopBar from './TopBar';
import NotLoggedIn from './NotLoggedIn';

const DEFAULT_PASSWORD = '123456';
const connectWithDefaultPwd = username =>
  Meteor.loginWithPassword(username, DEFAULT_PASSWORD);

const FourOhFour = () => <p>Page not found</p>;

const Page = ({ isNotLoggedIn, isRedirect, isStudent, path, ready }) => {
  if (isNotLoggedIn) {
    return <NotLoggedIn />;
  }
  if (!ready) {
    return process.env.NODE_ENV === 'production'
      ? <img src="/images/Spinner.gif" alt="" />
      : <NotLoggedIn />;
  }
  if (isRedirect) {
    return <Redirect to={path} />;
  }
  if (isStudent) {
    return <StudentView />;
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
        <Route component={FourOhFour} />
      </Switch>
    </div>
  );
};

const PageContainer = createContainer((props: any) => {
  const username = queryToObject(props.location.search.slice(1)).login;
  let ready = setupSubscriptions([
    'userData',
    'activity_data',
    'logs',
    'activities',
    'objects',
    'sessions',
    'openUploads',
    'operators',
    'connections',
    'products'
  ]);
  const loggedInUsername =
    Meteor.userId() &&
    Meteor.users.findOne(Meteor.userId()) &&
    Meteor.users.findOne(Meteor.userId()).username;
  if (username === 'teacher' || loggedInUsername === 'teacher') {
    ready =
      ready && setupSubscriptions(['global_settings', 'graphs', 'uploads']);
  }
  Meteor.subscribe('userData', {
    onReady: () => {
      const meteorUsername =
        Meteor.userId() && Meteor.users.findOne(Meteor.userId()).username;
      if (username && username !== meteorUsername) {
        if (!Meteor.users.findOne({ username })) {
          Accounts.createUser({ username, password: DEFAULT_PASSWORD }, () =>
            connectWithDefaultPwd(username)
          );
        } else {
          connectWithDefaultPwd(username);
        }
      }
    }
  });

  const isRedirect = ready && username && username === loggedInUsername;
  const isStudent = loggedInUsername !== 'teacher';
  const isNotLoggedIn = !loggedInUsername && !username;
  return {
    ...props,
    isNotLoggedIn,
    isRedirect,
    isStudent,
    ready: ready && loggedInUsername,
    path: props.location.path
  };
}, Page);

const setupSubscriptions = (collections: string[]) => {
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return every(subscriptions.map(x => x.ready()), Boolean);
};

PageContainer.displayName = 'PageContainer';
export default PageContainer;
