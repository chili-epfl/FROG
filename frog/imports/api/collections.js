// @flow
/***
 * This file initializes and exports all the Mongo collections used by
 * the api
 */

import { Mongo } from 'meteor/mongo';
import { type MongoT, type DashboardDataDbT } from 'frog-utils';

// Activity collections
export const Activities = new Mongo.Collection('activities');
export const Connections = new Mongo.Collection('connections');
export const DashboardData: MongoT<DashboardDataDbT> = new Mongo.Collection(
  'dashboard_data'
);

// Graph collections
export const Graphs = new Mongo.Collection('graphs');

// Log collections
export const Logs = new Mongo.Collection('logs');

// Object collections
export const Objects = new Mongo.Collection('objects');

// UploadList collections
export const UploadList = new Mongo.Collection('uploadList');

// Operator collections
export const Operators = new Mongo.Collection('operators');
export const ExternalOperators = new Mongo.Collection('external_operators');

// Products collections
export const Products = new Mongo.Collection('products');

// Session collections
export const Sessions = new Mongo.Collection('sessions');

// Settings collection
export const GlobalSettings = new Mongo.Collection('global_settings');
