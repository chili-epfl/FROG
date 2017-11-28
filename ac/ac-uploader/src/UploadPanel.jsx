// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import { uuid } from 'frog-utils';

export default ({
  activityData,
  data,
  dataFn,
  uploadFn,
  userInfo,
  setDone
}: Object) => {
  const maxFile = activityData.config.maxNumbFile
    ? activityData.config.maxNumbFile
    : 10;

  const onDrop = files => {
    files.forEach(file => {
      const fileId = uuid();
      uploadFn(file, fileId).then(url => {
        dataFn.objInsert({ url, key: fileId, studentId: userInfo.id }, fileId);
      });
    });
  };

  return (
    <Main>
      {Object.keys(data).length < maxFile && (
        <Dropzone
          onDrop={onDrop}
          style={{
            width: '60%',
            height: '150px',
            border: '2px dashed rgb(102, 102, 102)',
            borderRadius: '5px',
            textAlign: 'center'
          }}
        >
          <TextStyled>Drop files here</TextStyled>
        </Dropzone>
      )}
      <ButtonStyled className="btn btn-primary" onClick={() => setDone(true)}>
        Submit
      </ButtonStyled>
    </Main>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const TextStyled = styled.h3`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  margin: 0 auto;
`;

const ButtonStyled = styled.button`
  margin-left: 50px;
  margintop: 50px;
  height: 50px;
`;
