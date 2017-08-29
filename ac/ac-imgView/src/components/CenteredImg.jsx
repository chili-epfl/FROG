// @flow

import React from 'react';
import styled from 'styled-components';
import { ImageReload } from 'frog-utils';
import FlexView from 'react-flexview';

const CenteredImgComp = ({ url }: { url: string }) =>
  <FlexView
    hAlignContent="center"
    vAlignContent="center"
    height="100%"
    width="100%"
  >
    <ImageReload
      alt=""
      src={url}
      style={{ margin: 'auto', maxHeight: '100%', maxWidth: '100%' }}
    />
  </FlexView>;

CenteredImgComp.displayName = 'CenteredImg';
export default CenteredImgComp;
