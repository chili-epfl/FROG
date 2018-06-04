import { Meteor } from 'meteor/meteor';
import { shuffle } from 'lodash';

if (!Meteor.settings.Minio) {
  Meteor.methods({
    'minio.signedurl': name => '/file?name=' + name
  });
} else {
  Meteor.methods({
    'minio.signedurl': name =>
      `${shuffle(Meteor.settings.Minio.urls)}/uploads/${name}`
  });
}
