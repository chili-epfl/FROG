import { Mongo } from 'meteor/mongo';

export const GlobalSettings = new Mongo.Collection('global_settings');

export const getGlobalSetting = key => {
  const ret = GlobalSettings.findOne(1);
  return ret ? ret[key] : null;
};

export const getGlobalSettings = () => GlobalSettings.findOne(1) || {};

export const setGlobalSetting = (k, v) =>
  GlobalSettings.upsert(1, { $set: { [k]: v } });
