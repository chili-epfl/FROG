// @flow

import { DDP } from 'meteor/ddp-client';
import { Tracker } from 'meteor/tracker';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

let connection = null;
let dashboardCollection = null;

export default (callback: Function) => {
  if (!Meteor.settings.public.dashboard_server_url) {
    if (!dashboardCollection) {
      dashboardCollection = new Mongo.Collection('dashboard');
    }
    callback(dashboardCollection);
    return;
  }
  if (connection) {
    callback(dashboardCollection, connection);
  } else {
    const conn = DDP.connect(Meteor.settings.public.dashboard_server_url);
    dashboardCollection = new Mongo.Collection('dashboard', conn);
    Tracker.autorun(() => {
      if (conn.status().connected) {
        connection = conn;
        // Tracker.currentComputation.stop();
        callback(dashboardCollection, connection);
      }
    });
  }
};
