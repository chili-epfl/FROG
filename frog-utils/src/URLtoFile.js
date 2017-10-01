// @flow

export default (url: any, name: string, window: any) => {
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
    ((dataURI: string) => {
      let byteString;
      let i;
      // Parse the dataURI components as per RFC 2397
      const matches = dataURI.match(dataURIPattern);
      if (!matches) {
        throw new Error('invalid data URI');
      }
      // Default to text/plain;charset=US-ASCII
      const mediaType = matches[2]
        ? matches[1]
        : 'text/plain' + (matches[3] || ';charset=US-ASCII');
      const isBase64 = !!matches[4];
      const dataString = dataURI.slice(matches[0].length);
      if (isBase64) {
        // Convert base64 to raw binary data held in a string:
        byteString = window.atob(dataString);
      } else {
        // Convert base64/URLEncoded data component to raw binary:
        byteString = decodeURIComponent(dataString);
      }
      // Write the bytes of the string to an ArrayBuffer:
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);
      for (i = 0; i < byteString.length; i += 1) {
        intArray[i] = byteString.charCodeAt(i);
      }
      // Write the ArrayBuffer (or ArrayBufferView) to a blob:
      if (hasBlobConstructor) {
        return new Blob([hasArrayBufferViewSupport ? intArray : arrayBuffer], {
          type: mediaType
        });
      }
      const bb = new BlobBuilder();
      bb.append(arrayBuffer);
      return bb.getBlob(mediaType);
    });

  const blobToFile = (blob: any, str: string) => {
    const form = new FormData();
    form.append('image', blob, str + '.png');
    return form;
  };

  return dataURLtoBlob(url);
};
