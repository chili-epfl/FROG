// @flow

import { DDP } from 'meteor/ddp-client';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

let connection = null;
let dashboardCollection = null;

export default (): [any, any] => {
  if (!Meteor.settings.public.dashboard_server_url) {
    if (!dashboardCollection) {
      dashboardCollection = new Mongo.Collection('dashboard');
    }
    return [false, dashboardCollection];
  }
  if (connection) {
    return [connection, dashboardCollection];
  } else {
    connection = DDP.connect(Meteor.settings.public.dashboard_server_url);
    dashboardCollection = new Mongo.Collection('dashboard', connection);
    return [connection, dashboardCollection];
  }
};
