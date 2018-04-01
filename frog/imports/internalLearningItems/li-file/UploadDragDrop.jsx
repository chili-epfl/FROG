// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import uploadWithTumbnail from './utils';

const UploadDragDrop = ({
  dataFn,
  uploadFn,
  createLearningItem,
  onCreate
}: Object) => {
  const onDrop = f => {
    f.forEach(imageFile =>
      uploadWithTumbnail(
        imageFile,
        dataFn,
        uploadFn,
        'dragdrop-upload',
        createLearningItem,
        onCreate
      )
    );
  };

  return (
    <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
      <Dropzone
        onDropAccepted={onDrop}
        style={{
          width: '50%',
          border: '2px dashed rgb(102, 102, 102)',
          borderRadius: '5px',
          padding: '10px',
          minWidth: 'fit-content'
        }}
      >
        <TextStyled>Drop files here / Click to upload</TextStyled>
      </Dropzone>
    </div>
  );
};
// 'image/jpeg, image/png'
const TextStyled = styled.h3`
  position: relative;
  top: 55%;
  margin: 0 auto;
  transform: translateY(-50%);
`;

UploadDragDrop.displayName = 'UploadDragDrop';
export default UploadDragDrop;
