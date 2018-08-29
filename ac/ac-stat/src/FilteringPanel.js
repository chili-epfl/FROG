// @flow

import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Replay from '@material-ui/icons/Replay';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default ({
  data,
  dataFn,
  setTransformation,
  transformation,
  dataset,
  originalData
}: Object) => (
  <div style={{ display: 'flex', flexDirection: 'row' }}>
    <FormControl component="fieldset">
      <FormLabel component="legend">Gender</FormLabel>
      <RadioGroup value={transformation} onChange={e => console.log(e)}>
        <FormControlLabel value="female" control={<Radio />} label="None" />
        <FormControlLabel value="male" control={<Radio />} label="Log" />
        <FormControlLabel value="other" control={<Radio />} label="Exp" />
      </RadioGroup>
    </FormControl>
    <IconButton
      onClick={() => dataFn.objReplace(data, originalData[dataset], dataset)}
    >
      <Replay />
    </IconButton>
  </div>
);
