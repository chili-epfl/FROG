// @flow

import resizeImg from '@houshuang/resize-img';
import { uuid } from 'frog-utils';
import { uploadFile } from '../../api/openUploads';

const uploadBufferWithThumbnail = (
  imageBuffer,
  imageId,
  dataFn,
  type,
  filename,
  createLearningItem
) => {
  const ext = filename && filename.split('.').pop();
  if (!filename || ['jpg', 'png', 'jpeg'].includes(ext.toLowerCase())) {
    // upload a thumbnail
    resizeImg(imageBuffer, { width: 128 }).then(buffer => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      uploadFile(blob, imageId + 'thumb').then(thumburl => {
        resizeImg(imageBuffer, { width: 800 }).then(buffery => {
          const blob2 = new Blob([buffery], { type: 'image/jpeg' });
          uploadFile(blob2, imageId).then(url => {
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
    uploadFile(imageBuffer, imageId).then(url => {
      createLearningItem('li-file', {
        url,
        ext,
        filename
      });
    });
  }
};

export default (
  file: any,
  dataFn: Object,
  type: string,
  createLearningItem: Function
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
      type,
      filename,
      createLearningItem
    );
  };
  fr.readAsArrayBuffer(file);
};
