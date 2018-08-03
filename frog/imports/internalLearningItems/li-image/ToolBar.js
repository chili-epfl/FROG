// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import RotateLeft from '@material-ui/icons/RotateLeft'
import RotateRight from '@material-ui/icons/RotateRight'

export default ({data, dataFn}) =>
<div style={{backgroundColor: '#CCCCCC'}}>
  <IconButton
    onClick={() => null}
  >
    <ZoomIn />
  </IconButton>
  <IconButton
    onClick={() => null}
  >
    <ZoomOut />
  </IconButton>
  <IconButton
    onClick={() => dataFn.objInsert((data.rotation+90)%360,'rotation')}
  >
    <RotateLeft />
  </IconButton>
  <IconButton
    onClick={() => dataFn.objInsert((data.rotation-90)%360,'rotation')}
  >
    <RotateRight />
  </IconButton>
</div>
