// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

export default ({ data, dataFn, uploadFn }: Object) => {
  const onDrop = f => {
    uploadFn(f, url => {
      // setTimeout, otherwise HTTP request sends back code 503
      setTimeout(
        () => dataFn.objInsert({ url, votes: {} }, Object.keys(data).length),
        500
      );
    });
  };

  return (
    <div style={{ width: '50%', display: 'flex', justifyContent: 'center' }}>
      <Dropzone
        onDrop={onDrop}
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
