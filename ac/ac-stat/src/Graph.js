// @flow

import * as React from 'react';
import Plot from 'react-plotly.js';

import { withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  root: {
    width: '100px',
    height: 'fit-content'
  }
};

const transformData = (data, type) => {
  switch (type) {
    case 'dots':
      return data.map(trace => ({
        type: 'scatter',
        mode: 'markers',
        ...trace
      }));
    case 'lines':
      return data.map(trace => ({ type: 'scatter', mode: 'lines', ...trace }));
    case 'dots+lines':
      return data.map(trace => ({
        type: 'scatter',
        mode: 'lines+markers',
        ...trace
      }));
    case 'histogram':
      return data.map(trace => ({ type: 'histogram', ...trace }));
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
          <MenuItem value="dots+lines" selected>
            Linked dots
          </MenuItem>
          <MenuItem value="dots">Dots</MenuItem>
          <MenuItem value="line">Lines</MenuItem>
          <MenuItem value="box">Box</MenuItem>
          <MenuItem value="histogram">Histogram</MenuItem>
        </Select>
      )}
    </div>
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

export default withState('plot', 'setPlot', 'line')(
  withStyles(styles)(GraphStateless)
);
