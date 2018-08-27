// @flow

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const UploadList = new Mongo.Collection('uploadList');

export const addFileToList = (
  name: string,
  url: string,
  sessionId?: string
) => {
  UploadList.insert({ uploadDate: new Date(), name, url, sessionId });
};

export const uploadFile = (file: any, name: string, sessionId?: string) => {
  const prom: Promise<any> = new Promise((resolve, reject) => {
    Meteor.call('minio.signedurl', name, (err, succ) => {
      if (err) {
        reject(err);
      }
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', succ, true);
      xhr.send(file);
      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(succ);
        } else {
          reject();
        }
      };
    });
  }).then(url => {
    addFileToList(name, url, sessionId);
    return url;
  });
  return prom;
};

export const downloadFile = () => {};
