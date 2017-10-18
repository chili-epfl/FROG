// @flow
import { Meteor } from 'meteor/meteor';

export const uploadFile = (file: any, name: string) => {
  return new Promise((resolve, reject) => {
    Meteor.call('minio.signedurl', name, (err, succ) => {
      if (err) {
        console.error(err);
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
};
