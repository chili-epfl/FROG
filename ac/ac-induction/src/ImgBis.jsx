// @flow

import React from 'react';
import styled from 'styled-components';

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export default (props: { url: string }) =>
  <div
    style={{
      border: '2px solid black',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}
  >
    <Img src={props.url} alt="" />
  </div>;
