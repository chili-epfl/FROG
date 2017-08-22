// @flow

import React from 'react';
import Dropzone from 'react-dropzone';
import styled from 'styled-components';

export default ({ data, dataFn, uploadFn, userInfo }: Object) => {
  const onDrop = f => {
    uploadFn.uploadFile(f, url => {
      // setTimeout, otherwise HTTP request sends back code 503
      setTimeout(
        () =>
          dataFn.objInsert(
            { url, categories: ['uploaded'], votes: {} },
            Object.keys(data).length,
          ),
        500,
      );
    });
  };

  return (
    <Main>
      <Dropzone
        onDrop={onDrop}
        style={{
          width: '50%',
          border: '2px dashed rgb(102, 102, 102)',
          borderRadius: '5px',
          textAlign: 'center',
        }}
      >
        <TextStyled>Drop files here</TextStyled>
      </Dropzone>
    </Main>
  );
};

const Main = styled.div`
  width: 50%;
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
