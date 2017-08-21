// @flow

import { FS } from 'meteor/cfs:base-package';
import { OpenUploads } from '../../api/openUploads';

export const OpenUploads = new FS.Collection('openUploads', {
  stores: [new FS.Store.FileSystem('openUploads')]
});

OpenUploads.allow({ insert: () => true });

export const importFile = files => {
  if (files.length > 1) {
    window.alert('Only 1 file at a time please'); //eslint-disable-line
  } else {
    OpenUploads.insert(files[0], (err, fileObj) => {
      const newUrl =
        window.location.origin + '/cfs/files/openUploads/' + fileObj._id;
      // setState({
      //   urls: [...urls, newUrl]
      // });

    });
  }
};

export const getFile = url => {
  const all = OpenUploads.find();
  console.log(all);
  return (null);
}
