// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

import uploadWithTumbnail from '../utils';

const UploadDragDrop = ({
  dataFn,
  stream,
  uploadFn,
  logger,
  activityData
}: Object) => {
  const onDrop = f => {
    f.forEach(imageFile =>
      uploadWithTumbnail(
        imageFile,
        logger,
        dataFn,
        stream,
        uploadFn,
        'dragdrop-upload'
      )
    );
  };

  return (
    <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
      <Dropzone
        onDropAccepted={onDrop}
        accept={
          activityData.config.acceptAnyFiles ? null : 'image/jpeg, image/png'
        }
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

const TextStyled = styled.h3`
  position: relative;
  top: 55%;
  margin: 0 auto;
  transform: translateY(-50%);
`;

UploadDragDrop.displayName = 'UploadDragDrop';
export default UploadDragDrop;
