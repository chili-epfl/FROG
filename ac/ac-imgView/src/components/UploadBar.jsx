// @flow

import React from 'react';
import styled from 'styled-components';
import { withState } from 'recompose';

import UploadDragDrop from './UploadDragDrop';
import WebcamCapture from './WebcamInterface';

export default ({ data, dataFn, uploadFn, userInfo, setWebcam }: Object) =>
  <div style={{ width: '100%', height: '81px' }}>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: '10px',
      }}
    >
      <UploadDragDrop
        data={data}
        dataFn={dataFn}
        userInfo={userInfo}
        uploadFn={uploadFn}
      />
      <Main>
        <button onClick={() => setWebcam(true)} style={{ width: '50%' }}>
          Open the webcam
        </button>
      </Main>
    </div>
  </div>;

const Main = styled.div`
  width: 50%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
