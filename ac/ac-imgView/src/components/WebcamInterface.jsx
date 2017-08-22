// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import Mousetrap from 'mousetrap';

import { dataURItoFile, uuid } from 'frog-utils';

// if (!/https/.test(window.location.protocol))
//   window.location.protocol = 'https://';

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
          const url = webcam.getScreenshot();
          const file = dataURItoFile(url, uuid(), window);
          uploadFn.uploadFile(file, url => {
            // setTimeout, otherwise HTTP request sends back code 503
            setTimeout(
              () =>
                dataFn.objInsert(
                  { url, categories: ['uploaded'], votes: {} },
                  Object.keys(data).length
                ),
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
