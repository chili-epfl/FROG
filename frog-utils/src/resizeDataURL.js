// @flow

// get a dataURL and a 2 dimension array
// return an object containing an err variable = 0 if everything worked
// or = 1 if size didn't have 2 dimensions
// and a urlResult variable that contains the dataURL of the image resized

export default (url: string, size: Array<number>) => {
  let err = 0;
  let urlResult = url;
  if (size.length !== 2) err = 1;
  else {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, size[0], size[1]);
      urlResult = canvas.toDataURL('image/webp');
    };
  }

  return { urlResult, err };
};
