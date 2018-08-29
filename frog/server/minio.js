import { Meteor } from 'meteor/meteor';
import { shuffle } from 'lodash';

import { UploadList } from '/imports/api/openUploads';

Meteor.methods({
  'minio.signedurl': (name, sessionId) => {
    const url = !Meteor.settings.Minio
      ? '/file?name=' + name
      : `${shuffle(Meteor.settings.Minio.urls)}/uploads/${name}`;
    UploadList.insert({ uploadDate: new Date(), name, url, sessionId });
    return url;
  }
});
