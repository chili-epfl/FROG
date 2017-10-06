// @flow

import React from 'react';
import styled from 'styled-components';
import Webcam from '@houshuang/react-webcam';
import Mousetrap from 'mousetrap';

import uploadImage from '../utils';

const WebcamCapture = ({
  setWebcam,
  uploadFn,
  dataFn,
  logger,
  stream
}: Object) => {
  let webcam = { getScreenshot: () => null };
  Mousetrap.bind('esc', () => setWebcam(false));
  return (
    <WebcamContainer>
      <Webcam
        audio={false}
        ref={node => (webcam = node)}
        screenshotFormat="image/jpeg"
        style={{ width: '60%', height: '90%', margin: 'auto' }}
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          const dataURI = webcam.getScreenshot();
          if (!dataURI) {
            return;
          }
          // convert base64 to raw binary data held in a string
          // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
          const byteString = atob(dataURI.split(',')[1]);
          // separate out the mime component
          const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
          // write the bytes of the string to an ArrayBuffer
          const ab = new ArrayBuffer(byteString.length);
          // create a view into the buffer
          const ia = new Uint8Array(ab);
          // set the bytes of the buffer to the correct values
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          // write the ArrayBuffer to a blob, and you're done
          const blob = new Blob([ab], { type: mimeString });

          uploadImage(blob, logger, dataFn, stream, uploadFn);
          setWebcam(false);
        }}
        style={{
          height: '100px',
          marginTop: 'auto',
          marginBottom: 'auto',
          marginRight: 'auto'
        }}
      >
        Take a picture
      </button>
      <button
        onClick={() => setWebcam(false)}
        className="btn btn-secondary"
        style={{ position: 'absolute', right: '0px' }}
      >
        <span className="glyphicon glyphicon-remove" />
      </button>
    </WebcamContainer>
  );
};

WebcamCapture.displayName = 'WebcamCapture';
export default WebcamCapture;

const WebcamContainer = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: rgba(50, 50, 50, 0.8);
`;
