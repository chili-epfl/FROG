// @flow

export default (url, name, window) => {
  const CanvasPrototype =
    window.HTMLCanvasElement && window.HTMLCanvasElement.prototype;

  const hasBlobConstructor =
    window.Blob &&
    (() => {
      try {
        return Boolean(new Blob());
      } catch (e) {
        return false;
      }
    });

  const hasArrayBufferViewSupport =
    hasBlobConstructor &&
    window.Uint8Array &&
    (() => {
      try {
        return new Blob([new Uint8Array(100)]).size === 100;
      } catch (e) {
        return false;
      }
    });

  const BlobBuilder =
    window.BlobBuilder ||
    window.WebKitBlobBuilder ||
    window.MozBlobBuilder ||
    window.MSBlobBuilder;

  const dataURIPattern = /^data:((.*?)(;charset=.*?)?)(;base64)?,/;

  const dataURLtoBlob =
    (hasBlobConstructor || BlobBuilder) &&
    window.atob &&
    window.ArrayBuffer &&
    window.Uint8Array &&
    (dataURI => {
      let matches,
        mediaType,
        isBase64,
        dataString,
        byteString,
        arrayBuffer,
        intArray,
        i,
        bb;
      // Parse the dataURI components as per RFC 2397
      matches = dataURI.match(dataURIPattern);
      if (!matches) {
        throw new Error('invalid data URI');
      }
      // Default to text/plain;charset=US-ASCII
      mediaType = matches[2]
        ? matches[1]
        : 'text/plain' + (matches[3] || ';charset=US-ASCII');
      isBase64 = !!matches[4];
      dataString = dataURI.slice(matches[0].length);
      if (isBase64) {
        // Convert base64 to raw binary data held in a string:
        byteString = atob(dataString);
      } else {
        // Convert base64/URLEncoded data component to raw binary:
        byteString = decodeURIComponent(dataString);
      }
      // Write the bytes of the string to an ArrayBuffer:
      arrayBuffer = new ArrayBuffer(byteString.length);
      intArray = new Uint8Array(arrayBuffer);
      for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i);
      }
      // Write the ArrayBuffer (or ArrayBufferView) to a blob:
      if (hasBlobConstructor) {
        return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {
          type: mediaType,
        });
      }
      bb = new BlobBuilder();
      bb.append(arrayBuffer);
      return bb.getBlob(mediaType);
    });

  const blobToFile = (blob, name) => {
    const form = new FormData();
    console.log(blob);
    form.append('image', blob, name + '.png');
    console.log(form);
    return form;
  };

  return blobToFile(dataURLtoBlob(url), name);
};
