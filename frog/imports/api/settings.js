// @flow
import { Mongo } from 'meteor/mongo';

export const GlobalSettings = new Mongo.Collection('global_settings');
export const LocalSettings = ({ UrlCoda: '' }: {
  researchLogin?: boolean,
  debugLogin?: boolean,
  UrlCoda: string,
  follow?: string,
  scaled?: boolean,
  api?: boolean
});
