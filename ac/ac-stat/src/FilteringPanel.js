// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Replay from '@material-ui/icons/Replay';

export default ({data, dataFn, setTransformation, transformation, dataset, originalData}) => {
  return <div>
    <IconButton onClick={() => dataFn.objReplace(data, originalData[dataset], dataset)}>
      <Replay/>
    </IconButton>
  </div>
}
