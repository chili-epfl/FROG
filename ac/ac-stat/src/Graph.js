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

const transformData = (data, type, filtered) => {
  const result = [];
  if (
    filtered &&
    data.reduce((acc, cur) => acc && Object.keys(cur).length === 2, true)
  ) {
    const keys = data.reduce(
      (acc, cur) =>
        acc.includes(Object.values(cur)[1])
          ? acc
          : [...acc, Object.values(cur)[1]],
      []
    );
    switch (type) {
      case 'dots':
        keys.forEach(k => {
          const formatData = data
            .filter(x => Object.values(x)[1] === k)
            .map(entry => Object.values(entry)[0]);
          result.push({
            type: 'scatter',
            mode: 'markers',
            name: k,
            x: formatData
          });
        });
        break;
      case 'histogram':
        keys.forEach(k => {
          const formatData = data
            .filter(x => Object.values(x)[1] === k)
            .map(entry => Object.values(entry)[0]);
          result.push({
            type: 'histogram',
            histofunc: k,
            name: k,
            x: formatData
          });
        });
        break;
      case 'box':
        keys.forEach(k => {
          const formatData = data
            .filter(x => Object.values(x)[1] === k)
            .map(entry => Object.values(entry)[0]);
          result.push({
            type: 'box',
            name: k,
            x: formatData
          });
        });
        break;
      default:
    }
  } else {
    const formatData = data.map(entry => Object.values(entry)[0]);
    switch (type) {
      case 'dots':
        result.push({
          type: 'scatter',
          mode: 'markers',
          x: formatData
        });
        break;
      case 'histogram':
        result.push({ type: 'histogram', x: formatData }); // autobinx: false, xbins: {size: (max-min)/formatData.length, start: min, end: max}
        break;
      case 'box':
        result.push({ type: 'box', x: formatData });
        break;
      default:
    }
  }
  return result;
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
          <MenuItem value="histogram" selected>
            Histogram
          </MenuItem>
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
        config.plotType !== 'all' ? config.plotType : plot,
        config.sort
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
