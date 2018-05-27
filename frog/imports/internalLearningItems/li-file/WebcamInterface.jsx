// @flow

import React from 'react';
import Button from '@material-ui/core/Button';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Webcam from '@houshuang/react-webcam';

import uploadImage from './utils';

const takePicture = ({
  dataFn,
  webcam,
  setWebcam,
  createLearningItem,
  setSpinner
}) => {
  const dataURI = webcam.getScreenshot();
  if (!dataURI) {
    return;
  }
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  const byteString = atob(dataURI.split(',')[1]);
  // separate out the mime component
  const mimeString = dataURI
    .split(',')[0]
    .split(':')[1]
    .split(';')[0];
  // write the bytes of the string to an ArrayBuffer
  const ab = new ArrayBuffer(byteString.length);
  // create a view into the buffer
  const ia = new Uint8Array(ab);
  // set the bytes of the buffer to the correct values
  for (let i = 0; i < byteString.length; i += 1) {
    ia[i] = byteString.charCodeAt(i);
  }
  // write the ArrayBuffer to a blob, and you're done
  const blob = new Blob([ab], { type: mimeString });

  setSpinner(true);
  uploadImage(blob, dataFn, 'webcam-upload', createLearningItem, () => {
    setSpinner(false);
    setWebcam(false);
  });
};

const WebcamCapture = (props: Object) => {
  let webcam = { getScreenshot: () => null };
  return (
    <>
      <Webcam
        audio={false}
        ref={node => (webcam = node)}
        screenshotFormat="image/jpeg"
        style={{ width: '60%', height: '90%', margin: 'auto' }}
        onUserMediaError={e => console.error(e)}
      />
      <Button
        variant="fab"
        color="secondary"
        onClick={() => takePicture({ ...props, webcam })}
      >
        <PhotoCameraIcon />
      </Button>
    </>
  );
};

WebcamCapture.displayName = 'WebcamCapture';

const WebcamWrapper = (props: any) => (
  <Dialog open onClose={() => props.setWebcam(false)} maxWidth="md">
    <DialogTitle id="alert-dialog-slide-help">Take picture</DialogTitle>
    <DialogContent>
      <WebcamCapture {...props} />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => props.setWebcam(false)} color="primary">
        Close
      </Button>
    </DialogActions>
  </Dialog>
);

export default WebcamWrapper;
