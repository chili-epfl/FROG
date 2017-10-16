import { Meteor } from 'meteor/meteor';
import { shuffle } from 'lodash';

Meteor.methods({
  'minio.signedurl': name =>
    `${shuffle(Meteor.settings.Minio.urls)[0]}/uploads/${name}`
});
