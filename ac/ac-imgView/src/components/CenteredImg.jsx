// @flow

import React from 'react';
import styled from 'styled-components';

const CenteredImg = styled.img`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  padding: 5%;
`;

export default ({ url }: { url: string }) => <CenteredImg alt={''} src={url} />;
