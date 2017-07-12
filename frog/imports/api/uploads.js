// @flow
import { FS } from 'meteor/cfs:base-package';

export const Uploads = new FS.Collection('uploads', {
  stores: [new FS.Store.FileSystem('uploads')]
});

Uploads.allow({
  insert() {
    // add custom authentication code here
    return true;
  }
});
