// @flow

import * as React from 'react';
import Plot from 'react-plotly.js';
import stats from 'statsjs'

import { withState, compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';

const styles = {
  root: {
    width: '150px',
    height: 'fit-content'
  }
};

const transformData = (data, type, filtered) => {
  const result = [];
  if (filtered && data.columns.length > 1) {
    switch (type) {
      case 'dots':
        data.values
          .reduce(
            (acc, cur) => (acc.includes(cur[1]) ? acc : [...acc, cur[1]]),
            []
          )
          .forEach(k => {
            const formatData = data.values
              .filter(x => x[1] === k)
              .map(entry => entry[0]);
            result.push({
              type: 'scatter',
              mode: 'markers',
              name: k,
              y: formatData
            });
          });
        break;
      case 'histogram':
        data.values
          .reduce(
            (acc, cur) => (acc.includes(cur[1]) ? acc : [...acc, cur[1]]),
            []
          )
          .forEach(k => {
            const formatData = data.values
              .filter(x => x[1] === k)
              .map(entry => entry[0]);
            result.push({
              type: 'histogram',
              histofunc: k,
              name: k,
              x: formatData
            });
          });
        break;
      case 'box':
        data.values
          .reduce(
            (acc, cur) => (acc.includes(cur[1]) ? acc : [...acc, cur[1]]),
            []
          )
          .forEach(k => {
            const formatData = data.values
              .filter(x => x[1] === k)
              .map(entry => entry[0]);
            result.push({
              type: 'box',
              name: k,
              y: formatData
            });
          });
        break;
      default:
    }
  } else {
    const formatData = data.values.map(entry => entry[0]);
    switch (type) {
      case 'dots':
        result.push({
          type: 'scatter',
          mode: 'markers',
          y: formatData
        });
        break;
      case 'histogram':
        result.push({ type: 'histogram', x: formatData });
        // autobinx: false, xbins: {size: (max-min)/formatData.length, start: min, end: max}
        break;
      case 'box':
        result.push({ type: 'box', y: formatData });
        break;
      default:
    }
  }
  return result;
};

const GraphStateless = ({
  config,
  data,
  plot,
  setPlot,
  filter,
  setFilter,
  classes
}) => {
  const rawData = data.values;
  return (
    <div style={{ width: '70%' }}>
      <div style={{ display: 'flex' }}>
        <div style={{ display: 'flex' }}>
          <div>
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

          {data &&
            data.columns &&
            data.columns.length > 1 && (
              <div>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => setFilter(!filter)}
                >
                  {filter
                    ? 'Plot all data together'
                    : 'Use 2nd column to differentiate data'}
                </Button>
              </div>
            )}
        </div>
        <div />
      </div>
      Select a zone to zoom on it
      <br />
      Double click on the graph to zoom out
      <Plot
        config={{ displayModeBar: false }}
        data={transformData(
          data,
          config.plotType !== 'all' ? config.plotType : plot,
          filter
        )}
        style={{ position: 'sticky', left: '50%' }}
        layout={{
          title: config.title,
          xaxis: { title: config.xLabel },
          yaxis: { title: config.yLabel }
        }}
      />
      {config.summary &&
        rawData &&
        rawData.length > 0 && (
          <div style={{ width: 'fit-content' }}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Mean</TableCell>
                  <TableCell>
                    {Math.round(1000 * stats(rawData).mean()) / 1000}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Standard deviation</TableCell>
                  <TableCell>
                    {Math.round(1000 * stats(rawData).stdDev()) / 1000}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Median</TableCell>
                  <TableCell>
                    {Math.round(1000 * stats(rawData).median()) / 1000}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        )}
    </div>
  );
};

export default compose(
  withState('plot', 'setPlot', 'histogram'),
  withState('filter', 'setFilter', false)
)(withStyles(styles)(GraphStateless));
