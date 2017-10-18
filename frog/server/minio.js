import { Meteor } from 'meteor/meteor';
import { shuffle } from 'lodash';

if (process.env.NODE_ENV === 'production') {
  Meteor.methods({
    'minio.signedurl': name => 'http://localhost:3000/file?name=' + name
  });
} else {
  Meteor.methods({
    'minio.signedurl': name =>
      `${shuffle(Meteor.settings.Minio.urls)[0]}/uploads/${name}`
  });
}
