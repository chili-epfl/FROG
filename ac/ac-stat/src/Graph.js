// @flow

import * as React from 'react';
import Plot from 'react-plotly.js';

import { withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  root: {
    width: '150px',
    height: 'fit-content'
  }
};

const transformData = (data, type) => {
  // const realAxis = data.map(trace => 
  //     trace.filter ? Object.keys(trace).filter(axis => axis !== 'filter' && axis !== trace.filter)[0] : null
  // )


  switch (type) {
    case 'dots':
      return data.map(trace => ({
        type: 'scatter',
        mode: 'markers',
        ...trace
      }));
    case 'histogram':
      return data.map(trace => ({ type: 'histogram', data: trace['filter'], xbins: {size: 0.05, start: 0, end: 2}, }));
    case 'box':
      return data.reduce((acc, cur) => [...acc, { type: 'box', y: cur.y }], []);
    default:
      return data;
  }
};

const GraphStateless = ({ config, data, plot, setPlot, classes }) => (
  <div style={{ width: '70%' }}>
    <div style={{ display: 'flex', flexDirection: 'row', height: '40px' }}>
      <h3 style={{ width: '100px' }}>Diagram</h3>
      {config.plotType !== 'all' ? (
        config.plotType
      ) : (
        <Select
          value={plot}
          onChange={e => setPlot(e.target.value)}
          classes={{ root: classes.root }}
        >
          <MenuItem value="histogram" selected>Histogram</MenuItem>
          <MenuItem value="dots">Dots</MenuItem>
          <MenuItem value="box">Box</MenuItem>
        </Select>
      )}
    </div>
    Select a zone to zoom on it
    <br />
    Double click on the graph to zoom out
    <Plot
      config={{ displayModeBar: false }}
      data={transformData(
        data,
        config.plotType !== 'all' ? config.plotType : plot
      )}
      style={{ position: 'sticky', left: '50%' }}
      layout={{
        title: config.title,
        xaxis: { title: config.xLabel },
        yaxis: { title: config.yLabel }
      }}
    />
  </div>
);

export default withState('plot', 'setPlot', 'histogram')(
  withStyles(styles)(GraphStateless)
);
