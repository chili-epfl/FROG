// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';
import sharp from 'sharp';


import { uuid } from 'frog-utils';

const UploadDragDrop = ({ data, dataFn, stream, uploadFn, logger }: Object) => {
  const onDrop = f => {
    if(f.length > 1){
      window.alert('Only 1 file at a time please'); //eslint-disable-line
      return;
    }
    const imageFile = f[0]
    console.log('imageFile', imageFile)
    const fr = new FileReader();

    fr.onloadend = (loaded) => {
      console.log('onloadend')
      console.log(loaded)
      const imageBuffer = loaded.currentTarget.result
      const thumbnailFile = sharp(imageBuffer)
        .resize(10, 10)
        .jpeg()
        .toFile()
      console.log(thumbnailFile)
      uploadFn([ thumbnailFile ], url => {
        logger('upload');
        // setTimeout, otherwise HTTP request sends back code 503
        setTimeout(() => {
          dataFn.objInsert({ url, votes: {} }, Object.keys(data).length);
          if (stream) { stream.objInsert({ url }, uuid()); }
        }, 500);
      });
    }

    fr.readAsArrayBuffer(imageFile);
  };

  return (
    <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
      <Dropzone
        onDropAccepted={onDrop}
        accept="image/jpeg, image/png"
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
