// @flow

import React from 'react';
import styled from 'styled-components';

import UploadDragDrop from './UploadDragDrop';

const UploadBar = (props: Object) => (
  <Main>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <Container>
      <UploadDragDrop {...props} />
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => props.setWebcam(true)}
          style={{
            width: '50%',
            minWidth: 'fit-content',
            border: '2px dashed rgb(102, 102, 102)',
            borderRadius: '5px',
            padding: '10px'
          }}
        >
          <TextStyled>Open the webcam</TextStyled>
        </button>
      </div>
    </Container>
  </Main>
);
const TextStyled = styled.h3`
  position: relative;
  top: 55%;
  margin: 0 auto;
  transform: translateY(-50%);
`;

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
