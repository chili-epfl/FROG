// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import RotateLeft from '@material-ui/icons/RotateLeft';
import RotateRight from '@material-ui/icons/RotateRight';
import Close from '@material-ui/icons/Close';

export default ({ data, dataFn }: Object) => (
  <div style={{ backgroundColor: '#CCCCCC', zIndex: 1 }}>
    <IconButton
      onClick={() => dataFn.objInsert((data.scale || 1) * 1.2, 'scale')}
    >
      <ZoomIn />
    </IconButton>
    <IconButton
      onClick={() => dataFn.objInsert((data.scale || 1) * 0.8, 'scale')}
    >
      <ZoomOut />
    </IconButton>
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
    <IconButton
      onClick={() => {
        dataFn.objInsert(0, 'rotation');
        dataFn.objInsert(1, 'scale');
      }}
    >
      <Close />
    </IconButton>
  </div>
);
