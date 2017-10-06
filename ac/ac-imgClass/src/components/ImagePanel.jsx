// @flow

import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  flex: 0 1 auto;
`;

const ImgPanel = styled.img`
  max-width: 80%;
  max-height: 80%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export default ({ url }: { url: string }) =>
  <Container>
    <ImgPanel src={url} />
  </Container>;
