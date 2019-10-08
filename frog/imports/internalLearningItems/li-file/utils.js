// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from '/imports/frog-utils';

export const uploadBufferWithThumbnail = (
  imageBuffer: any,
  imageId: string,
  dataFn: Object,
  type: string,
  filename: string,
  createLearningItem: Function,
  cb?: Function
) => {
  const ext = filename && filename.split('.').pop();
  if (!filename || ['jpg', 'png', 'jpeg'].includes(ext.toLowerCase())) {
    // upload a thumbnail
    resizeImg(imageBuffer, { max: 128 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      dataFn.uploadFn(blob, imageId + 'thumb').then(thumburl => {
        resizeImg(imageBuffer, { max: 800 }).then(buffery => {
          const blob2 = new Blob([buffery], { type: 'image/jpeg' });
          dataFn.uploadFn(blob2, imageId).then(url => {
            if (cb) {
              cb();
            }
            createLearningItem('li-image', {
              url,
              thumburl,
              filename
            });
          });
        });
      });
    });
  } else {
    dataFn.uploadFn(imageBuffer, imageId).then(url => {
      if (cb) {
        cb();
      }
      createLearningItem(
        'li-file',
        {
          url,
          ext,
          filename
        },
        undefined,
        true
      );
    });
  }
};

export default (
  file: any,
  dataFn: Object,
  type: string,
  createLearningItem: Function,
  cb?: Function
) => {
  const fr = new FileReader();
  const imageId = uuid();
  const filename = file.name;

  fr.onloadend = (loaded: Object) => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(
      imageBuffer,
      imageId,
      dataFn,
      type,
      filename,
      createLearningItem,
      cb
    );
  };
  fr.readAsArrayBuffer(file);
};
