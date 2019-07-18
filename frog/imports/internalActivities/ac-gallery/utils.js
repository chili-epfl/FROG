// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from '/imports//imports/frog-utils';

const uploadBufferWithThumbnail = (
  imageBuffer,
  imageId,
  logger,
  dataFn,
  stream,
  type,
  filename
) => {
  logger({ type, itemId: imageId, value: filename });

  const ext = filename && filename.split('.').pop();
  if (!filename || ['jpg', 'png'].includes(ext)) {
    // upload a thumbnail
    resizeImg(imageBuffer, { width: 128 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      dataFn.uploadFn(blob, imageId + 'thumb').then(url => {
        dataFn.objInsert(url, [imageId, 'thumbnail']);
        stream(url, [imageId, 'thumbnail']);
      });
    });

    // upload a bigger picture
    resizeImg(imageBuffer, { width: 800 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      dataFn.uploadFn(blob, imageId).then(url => {
        dataFn.objInsert(url, [imageId, 'url']);
        stream(url, [imageId, 'url']);
      });
    });
    if (filename) {
      dataFn.objInsert(filename, [imageId, 'filename']);
      stream(filename, [imageId, 'filename']);
    }
  } else {
    dataFn.uploadFn(imageBuffer, imageId).then(url => {
      dataFn.objInsert({ url, ext, filename }, imageId);
      stream({ url, ext, filename }, imageId);
    });
  }
};

export default (
  file: any,
  logger: Function,
  dataFn: Object,
  stream: Function,
  type: string
) => {
  const fr = new FileReader();

  const imageId = uuid();
  dataFn.objInsert({ votes: {}, comment: '', key: imageId }, imageId);
  stream(imageId, [imageId, 'key']);
  const filename = file.name;

  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(
      imageBuffer,
      imageId,
      logger,
      dataFn,
      stream,
      type,
      filename
    );
  };
  fr.readAsArrayBuffer(file);
};
