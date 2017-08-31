// @flow

import React from 'react';
import styled from 'styled-components';

import UploadDragDrop from './UploadDragDrop';

const UploadBar = (props: Object) =>
  <Main>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <Container>
      <UploadDragDrop {...props} />
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => props.setWebcam(true)}
          style={{ width: '50%', minWidth: 'fit-content' }}
        >
          <h3 style={{ margin: 'auto' }}> Open the webcam </h3>
        </button>
      </div>
    </Container>
  </Main>;

const Main = styled.div`
  width: 100%;
  height: 81px;
  position: absolute;
  bottom: 0;
  background-color: white;
`;

const Container = styled.div`
  height: 90%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding-top: 10px;
`;

UploadBar.displayName = 'UploadBar';
export default UploadBar;
