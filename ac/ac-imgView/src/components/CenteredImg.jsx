// @flow

import React from 'react';
import styled from 'styled-components';
import { ImageReload } from 'frog-utils';

const CenteredImgDiv = styled.div`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 5%;
`;

const CenteredImg = props =>
  <CenteredImgDiv>
    <ImageReload {...props} />
  </CenteredImgDiv>;

const CenteredImgComp = ({ url }: { url: string }) =>
  <CenteredImg alt={''} src={url} />;

CenteredImgComp.displayName = 'CenteredImg';
export default CenteredImgComp;
