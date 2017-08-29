// @flow

import React from 'react';
import styled from 'styled-components';
import { ImageReload } from 'frog-utils';

const CenteredImgComp = ({ url }: { url: string }) =>
  <ImageReload
    alt=""
    src={url}
    style={{ maxHeight: '100%', maxWidth: '100%' }}
  />;

CenteredImgComp.displayName = 'CenteredImg';
export default CenteredImgComp;
