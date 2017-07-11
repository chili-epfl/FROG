// @flow
import { FS } from 'meteor/cfs:base-package';

export const Uploads = new FS.Collection('uploads', {
  stores: [new FS.Store.FileSystem('uploads')]
});

export const addUpload = (host: string, doc: string) => {
  let urlTmp = '';
  Uploads.insert(doc, (err, fileObj) => {
    urlTmp = host + '/cfs/files/uploads/' + fileObj._id;
  });
  return urlTmp;
}

Uploads.allow({
  insert() {
    // add custom authentication code here
    return true;
  }
});
