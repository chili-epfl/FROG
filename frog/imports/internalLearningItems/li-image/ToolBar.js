// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';

export default ({ data, dataFn }: Object) => (
  <div style={{ backgroundColor: '#CCCCCC', zIndex: 1 }}>
    <IconButton
      onClick={() =>
        dataFn.objInsert(((data.rotation || 0) + 90) % 360, 'rotation')
      }
    >
      <RotateLeft />
    </IconButton>
    <IconButton
      onClick={() =>
        dataFn.objInsert(((data.rotation || 0) - 90) % 360, 'rotation')
      }
    >
      <RotateRight />
    </IconButton>
  </div>
);
