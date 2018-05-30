// @flow

import React from 'react';
import { ImageReload } from 'frog-utils';

const CenteredImgComp = ({ url }: { url: string }) => (
  <ImageReload
    alt=""
    src={url}
    style={{
      maxWidth: '100%',
      maxHeight: '100%',
      left: '50%',
      top: '50%',
      padding: '5%'
    }}
  />
);

CenteredImgComp.displayName = 'CenteredImg';
export default CenteredImgComp;
