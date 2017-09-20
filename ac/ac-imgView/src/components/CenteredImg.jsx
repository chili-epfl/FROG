// @flow

import React from 'react';
import { ImageReload } from 'frog-utils';

const CenteredImgComp = ({ url }: { url: string }) =>
  <ImageReload
    alt=""
    src={url}
    style={{
      position: 'absolute',
      maxWidth: '100%',
      maxHeight: '100%',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '5%'
    }}
  />;

CenteredImgComp.displayName = 'CenteredImg';
export default CenteredImgComp;
