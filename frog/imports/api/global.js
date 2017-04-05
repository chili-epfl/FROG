import { Mongo } from 'meteor/mongo';

export const GlobalSettings = new Mongo.Collection('global_settings');

export const getGlobalSetting = key => {
  const ret = GlobalSettings.find(1).fetch();
  return ret ? ret[0][key] : null;
};

export const getGlobalSettings = () => {
  const ret = GlobalSettings.find(1).fetch();
  return ret || {};
};

export const setGlobalSetting = (k, v) =>
  GlobalSettings.upsert(1, { $set: { [k]: v } });
