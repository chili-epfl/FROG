// @flow

import { FS } from 'meteor/cfs:base-package';

export const OpenUploads = new FS.Collection('openUploads', {
  stores: [new FS.Store.FileSystem('openUploads')]
});

OpenUploads.allow({ insert: () => true });

export const uploadFile = (files: Array<any>, callback: string => any) => {
  if (files.length > 5) {
    window.alert('Too many files, 5 maximum at the time');//eslint-disable-line
  } else {
    //eslint-disable-line
    files.forEach(x => {
      OpenUploads.insert(x, (err, fileObj) => {
        const url =
          window.location.origin + '/cfs/files/openUploads/' + fileObj._id;
        if (!err) callback(url);
        else {
          window.alert('Cannot upload'); //eslint-disable-line
        }
      });
    });
  }
};
