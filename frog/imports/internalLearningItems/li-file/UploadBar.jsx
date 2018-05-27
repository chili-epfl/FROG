// @flow

import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import UploadDragDrop from './UploadDragDrop';

const UploadBar = (props: Object) => (
  <Main>
    <Container>
      <UploadDragDrop {...props} />
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <Button
          color="primary"
          variant="raised"
          onClick={() => props.setWebcam(true)}
        >
          Open the webcam
        </Button>
      </div>
    </Container>
  </Main>
);

const Main = styled.div`
  width: 100%;
  height: 81px;
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
