// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from 'frog-utils';

const uploadBufferWithThumbnail = (
  imageBuffer,
  imageId,
  dataFn,
  uploadFn,
  type,
  filename,
  createLearningItem,
  onCreate
) => {
  const ext = filename && filename.split('.').pop();
  if (!filename || ['jpg', 'png'].includes(ext)) {
    // upload a thumbnail
    resizeImg(imageBuffer, { width: 128 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      uploadFn(blob, imageId + 'thumb').then(thumburl => {
        resizeImg(imageBuffer, { width: 800 }).then(buffery => {
          const blob2 = new Blob([buffery], { type: 'image/jpeg' });
          uploadFn(blob2, imageId).then(url => {
            const id = createLearningItem('li-image', {
              url,
              thumburl,
              filename
            });
            onCreate(id);
          });
        });
      });
    });
  } else {
    uploadFn(imageBuffer, imageId).then(url => {
      const id = createLearningItem('li-file', {
        url,
        ext,
        filename
      });
      onCreate(id);
    });
  }
};

export default (
  file: any,
  dataFn: Object,
  uploadFn: Function,
  type: string,
  createLearningItem: Function,
  onCreate: Function
) => {
  const fr = new FileReader();

  const imageId = uuid();
  const filename = file.name;

  fr.onloadend = loaded => {
    const imageBuffer = Buffer.from(loaded.currentTarget.result);
    uploadBufferWithThumbnail(
      imageBuffer,
      imageId,
      dataFn,
      uploadFn,
      type,
      filename,
      createLearningItem,
      onCreate
    );
  };
  fr.readAsArrayBuffer(file);
};
