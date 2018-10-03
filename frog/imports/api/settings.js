// @flow
import { Mongo } from 'meteor/mongo';

export const GlobalSettings = new Mongo.Collection('global_settings');
export const LocalSettings = ({}: { researchLogin?: boolean });
