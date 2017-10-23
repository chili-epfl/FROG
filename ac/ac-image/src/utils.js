// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from 'frog-utils';

const uploadBufferWithThumbnail = (
  imageBuffer,
  imageId,
  logger,
  dataFn,
  stream,
  uploadFn
) => {
  logger({ type: 'upload', itemId: imageId });

  // upload a thumbnail
  resizeImg(imageBuffer, { width: 128 }).then(buffer => {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    uploadFn(blob, imageId + 'thumb').then(url => {
      dataFn.objInsert(url, [imageId, 'thumbnail']);
      stream(url, [imageId, 'thumbnail']);
    });
  });

  // upload a bigger picture
  resizeImg(imageBuffer, { width: 800 }).then(buffer => {
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    uploadFn(blob, imageId).then(url => {
      dataFn.objInsert(url, [imageId, 'url']);
      stream(url, [imageId, 'url']);
    });
  });
};

export default (
  file: any,
  logger: Function,
  dataFn: Object,
  stream: Function,
  uploadFn: Function
) => {
  const fr = new FileReader();

  const imageId = uuid();
  dataFn.objInsert({ votes: {}, key: imageId }, imageId);
  stream(imageId, [imageId, 'key']);

  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(
      imageBuffer,
      imageId,
      logger,
      dataFn,
      stream,
      uploadFn
    );
  };
  fr.readAsArrayBuffer(file);
};
