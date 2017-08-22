// @flow

import React from 'react';
import styled from 'styled-components';
import Webcam from 'react-webcam';
import { withState } from 'recompose';

export default withState(
  'cameraOpen',
  'setCameraOpen',
  false,
)(({ data, dataFn, uploadFn, userInfo }) =>
  <Main>
    {cameraOpen &&
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={webcam => (this.webcam = webcam)}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button
          onClick={() => {
            const url = this.webcam.getScreenshot();
            dataFn.objInsert(
              { url, categories: ['uploaded'], votes: {} },
              Object.keys(data).length,
            );
            setCameraOpen(false);
          }}
        >
          Take a picture
        </button>
      </div>}
    <ButtonStyled onClick={() => setCameraOpen(true)}>
      Open the webcam
    </ButtonStyled>
  </Main>,
);

const Main = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const ButtonStyled = styled.button`width: 50%;`;
