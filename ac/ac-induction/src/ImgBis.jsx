// @flow

import React from 'react';
import { Img } from './StyledComponents';

export default ({ url, color }: Object) => (
  <div
    style={{
      border: '2px solid',
      borderColor: color,
      width: '100%',
      height: '100%',
      position: 'relative'
    }}
  >
    <Img src={url} />
  </div>
);
