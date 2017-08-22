// @flow

import React from 'react';
import styled from 'styled-components';
import { withState } from 'recompose';

import UploadDragDrop from './UploadDragDrop';
import WebcamCapture from './WebcamInterface';

export default ({ data, dataFn, uploadFn, userInfo, setWebcam }: Object) =>
  <div style={{ width: '100%', height: '81px' }}>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <Container>
      <UploadDragDrop
        data={data}
        dataFn={dataFn}
        userInfo={userInfo}
        uploadFn={uploadFn}
      />
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setWebcam(true)}
          style={{ width: '50%' }}
        >
          Open the webcam
        </button>
      </div>
    </Container>
  </div>;

const Container = styled.div`
  height: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 10px;
`;
