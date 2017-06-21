// @flow

import { Mongo } from 'meteor/mongo';

export const GlobalSettings = new Mongo.Collection('global_settings');

export const getGlobalSetting = (key: string): any => {
  const ret = GlobalSettings.findOne(1);
  return ret ? ret[key] : null;
};

export const getGlobalSettings = () => GlobalSettings.findOne(1) || {};

export const setGlobalSetting = (k: string, v: any) =>
  GlobalSettings.upsert(1, { $set: { [k]: v } });
