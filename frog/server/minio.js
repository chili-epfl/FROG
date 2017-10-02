import Minio from 'minio';
import { Meteor } from 'meteor/meteor';
import { shuffle } from 'lodash';

const clients = Meteor.settings.Minio.urls.map(
  ep =>
    new Minio.Client({
      endPoint: ep,
      port: 9000,
      secure: false,
      accessKey: Meteor.settings.Minio.accessKey,
      secretKey: Meteor.settings.Minio.secretKey
    })
);

Meteor.methods({
  'minio.signedurl': name =>
    Promise.await(
      new Promise((resolve, reject) =>
        client.presignedPutObject('uploads', name, (err, url) => {
          if (err) throw reject(err);
          resolve(url);
        })
      )
    )
});
