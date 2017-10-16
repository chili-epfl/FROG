// @flow

import React from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import Mousetrap from 'mousetrap';

const WebcamCapture = ({ setWebcam, uploadFn, data, dataFn }: Object) => {
  let webcam = { getScreenshot: () => null };
  Mousetrap.bind('esc', () => setWebcam(false));
  return (
    <WebcamContainer>
      <Webcam
        audio={false}
        ref={node => (webcam = node)}
        style={{ width: '60%', height: '90%', margin: 'auto' }}
      />
      <button
        className="btn btn-primary"
        onClick={() => {
          const dataURL = webcam.getScreenshot();
          const file = dataURL;
          uploadFn(file, url => {
            // setTimeout, otherwise HTTP request sends back code 503
            setTimeout(
              () =>
                dataFn.objInsert({ url, votes: {} }, Object.keys(data).length),
              1000
            );
          });
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
