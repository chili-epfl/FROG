// @flow

import * as React from 'react';
import Plot from 'react-plotly.js';

import { withState } from 'recompose'
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  root: {
    width: '100px',
    height: 'fit-content'
  }
}

const GraphStateless = ({data, plot, setPlot, classes}) => (
  <div style={{width: '70%'}}>
    <div style={{display: 'flex', flexDirection: 'row', height: '40px'}}>
    <h3 style={{width: '100px'}}>Diagram</h3>
    <Select
      value={plot}
      onChange={e => setPlot(e.target.value)}
      classes={{root: classes.root}}>
      <MenuItem value="line" selected>Line</MenuItem>
      <MenuItem value='box'>Box</MenuItem>
      <MenuItem value='bar'>Bar</MenuItem>
    </Select>
    </div>
    <Plot config={{displayModeBar: false}} data={data} style={{position: 'sticky', left: '50%'}}/>
  </div>
)

export default withState('plot', 'setPlot', 'line')(withStyles(styles)(GraphStateless))
