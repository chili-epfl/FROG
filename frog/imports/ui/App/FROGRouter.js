import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Accounts } from 'meteor/accounts-base';
import { toObject as queryToObject } from 'query-parse';

const Page = (props) => <p>{JSON.stringify(props)</p>

const PageContainer = createContainer((props: { match: Object }) => {
  const username = queryToObject(props.location.search);
  let ready = setupSubscriptions([
    'userData',
    'activity_data',
    'logs',
    'activities',
    'objects',
    'sessions'
  ]);
  if (username === 'teacher') {
    ready =
      ready &&
      setupSubscriptions([
        'operators',
        'connections',
        'global_settings',
        'graphs',
        'products',
        'uploads'
      ]);
  }
  Meteor.subscribe('userData', {
    onReady: () => {
      const loggedInUsername =
        Meteor.userId() && Meteor.users.findOne(Meteor.userId()).username;
      if (username && username !== loggedInUsername) {
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
  return { ...props, username, ready };
}, Page);

const setupSubscriptions = (collections: string[]) => {
  const subscriptions = collections.map(x => Meteor.subscribe(x));
  return every(subscriptions.map(x => x.ready()), Boolean);
};

PageContainer.displayName = 'PageContainer'
export default PageContainer
