// @flow

import React from 'react';
import styled from 'styled-components';

import UploadDragDrop from './UploadDragDrop';

export default ({ data, dataFn, uploadFn, setWebcam }: Object) =>
  <Main>
    <div style={{ width: '100%', height: '1px', backgroundColor: 'black' }} />
    <Container>
      <UploadDragDrop data={data} dataFn={dataFn} uploadFn={uploadFn} />
      <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
        <button
          className="btn btn-secondary"
          onClick={() => setWebcam(true)}
          style={{ width: '50%' }}
        >
          <TextStyled> Open the webcam </TextStyled>
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

const TextStyled = styled.h3`
  position: relative;
  top: 35%;
  margin: 0 auto;
  transform: translateY(-50%);
`;
