// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

import uploadWithTumbnail from './utils';

const UploadDragDrop = ({
  dataFn,
  fileTypes,
  createLearningItem,
  setSpinner
}: Object) => {
  const onDrop = f => {
    setSpinner(true);
    f.forEach(imageFile =>
      uploadWithTumbnail(
        imageFile,
        dataFn,
        'dragdrop-upload',
        createLearningItem,
        () => setSpinner(false)
      )
    );
  };
  const baseStyle = {
    width: '75%',
    height: '90px',
    cursor: 'pointer'
  };
  return (
    <Dropzone
      onDropAccepted={onDrop}
      accept={fileTypes || undefined}
      style={{
        ...baseStyle,
        backgroundColor: '#F0F0F0',
        border: 'dashed',
        borderColor: '#C8C8C8'
      }}
      acceptStyle={{
        ...baseStyle,
        border: 'solid',
        borderColor: '#C8C8C8',
        backgroundImage:
          'repeating-linear-gradient(-45deg, #F0F0F0, #F0F0F0 25px, #C8C8C8 25px, #C8C8C8 50px)',
        animation: 'progress 2s linear infinite !important',
        backgroundSize: '150% 100%'
      }}
      rejectStyle={{
        ...baseStyle,
        border: 'solid',
        borderColor: '#C8C8C8',
        backgroundImage:
          'repeating-linear-gradient(-45deg, #fc8785, #fc8785 25px, #f4231f 25px, #f4231f 50px)',
        animation: 'progress 2s linear infinite !important',
        backgroundSize: '150% 100%'
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '18px' }}>
          <CloudUploadIcon /> Drag and drop a file here or click to upload
        </p>
      </div>
    </Dropzone>
  );
};

UploadDragDrop.displayName = 'UploadDragDrop';
export default UploadDragDrop;
