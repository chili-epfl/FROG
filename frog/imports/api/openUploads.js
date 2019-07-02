// @flow

import { Meteor } from 'meteor/meteor';

import { UploadList } from '/imports/collections';

export const uploadFile = (file: any, name: string, sessionId?: string) => {
  const prom: Promise<any> = new Promise((resolve, reject) => {
    Meteor.call('minio.signedurl', name, sessionId, (err, succ) => {
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
  });
  return prom;
};

export const downloadFile = () => {};
