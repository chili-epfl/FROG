// @flow

import resizeImg from 'resize-img';
import { uuid } from 'frog-utils';

export default (
  file: any,
  logger: Function,
  dataFn: Object,
  stream: Function,
  uploadFn: Function
) => {
  const fr = new FileReader();

  const imageId = uuid();
  dataFn.objInsert({ votes: {} }, imageId);

  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);

    // upload a thumbnail
    resizeImg(imageBuffer, { width: 128 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      uploadFn([blob], url => {
        setTimeout(() => {
          dataFn.objInsert(url, [imageId, 'thumbnail']);
          if (stream) {
            stream.objInsert(url, [imageId, 'thumbnail']);
          }
        }, 500);
      });
    });

    // upload a bigger picture
    resizeImg(imageBuffer, { width: 1024 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      uploadFn([blob], url => {
        logger('upload');
        setTimeout(() => {
          dataFn.objInsert(url, [imageId, 'url']);
          if (stream) {
            stream.objInsert(url, [imageId, 'url']);
          }
        }, 500);
      });
    });
  };
  fr.readAsArrayBuffer(file);
};
