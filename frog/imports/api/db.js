import { Mongo } from 'meteor/mongo';

export const Logs = new Mongo.Collection('logs')
export const Activities = new Mongo.Collection('activities');
export const Graphs = new Mongo.Collection('graphs');
export const Sessions = new Mongo.Collection('sessions');
