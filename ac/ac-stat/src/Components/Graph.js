// @flow

import * as React from 'react';
import Plot from 'react-plotly.js';
import stats from 'statsjs';

import { withState, compose } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

const styles = () => ({
  root: {
    flex: '1 1 auto',
    overflow: 'auto',
    padding: '4px',
    margin: '4px',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    flex: '0 0 auto'
  },
  plotContainer: {
    flex: '1 1 0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  plot: {
    width: '90%',
    height: '90%'
  }
});

const transformData = (data, type, filtered, sortData) => {
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
              // autobinx: false, xbins: {size: (max-min)/formatData.length, start: min, end: max}
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
    if (sortData) {
      formatData.sort();
    }
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
        break;
      case 'box':
        result.push({ type: 'box', y: formatData });
        break;
      default:
    }
  }
  return result;
};

const StatTable = ({ rawData }) => (
  <Table>
    <TableBody>
      <TableRow>
        <TableCell>Mean</TableCell>
        <TableCell>{Math.round(1000 * stats(rawData).mean()) / 1000}</TableCell>
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
);

const PlotTypeSelector = ({ plotTypes, plot, setPlot, logger }) => (
  <Select
    value={plot}
    onChange={e => {
      logger({ type: 'change diagram', itemId: e.target.value });
      setPlot(e.target.value);
    }}
  >
    {plotTypes.includes('histogram') && (
      <MenuItem value="histogram" selected>
        Histogram
      </MenuItem>
    )}
    {plotTypes.includes('dots') && <MenuItem value="dots">Dots</MenuItem>}
    {plotTypes.includes('box') && <MenuItem value="box">Boxplot</MenuItem>}
  </Select>
);

const SplitDataButton = ({ filter, setFilter, logger }) => (
  <Button
    variant="outlined"
    color="primary"
    onClick={() => {
      logger({ type: 'set filter', itemId: !filter });
      setFilter(!filter);
    }}
  >
    {filter ? 'Plot all data together' : 'Use 2nd column to differentiate data'}
  </Button>
);

const GraphStateless = props => {
  const { config, data, plot, axis, filter, classes } = props;
  if (!data || !data.columns || !data.values) return <p>No data</p>;
  const rawData = data.values.map(e => e[0]);
  const plotTypes = config.plotTypes?.length === 1 ? config.plotTypes : plot;
  const dataTr = transformData(data, plotTypes, filter, config.sortData);
  return (
    <Paper className={classes.root}>
      <div className={classes.header}>
        {config.plotTypes?.length > 1 && (
          <PlotTypeSelector plotTypes={config.plotTypes || []} {...props} />
        )}
        {data.columns.length > 1 && <SplitDataButton {...props} />}
      </div>
      <div className={classes.plotContainer}>
        <Plot
          className={classes.plot}
          config={{ displayModeBar: false }}
          data={dataTr}
          layout={{
            xaxis:
              config.fixAxis && plot === 'histogram'
                ? { title: config.xLabel, range: axis }
                : { title: config.xLabel },
            yaxis:
              config.fixAxis && plot !== 'histogram'
                ? { title: config.yLabel, range: axis }
                : { title: config.yLabel },
            margin: { t: 30, l: 30, r: 30, b: 30 },
            autosize: true,
            hovermode: false
          }}
          useResizeHandler
        />
      </div>
      {config.summary && rawData.length > 0 && <StatTable rawData={rawData} />}
    </Paper>
  );
};

export default compose(
  withState('plot', 'setPlot', 'histogram'),
  withState('filter', 'setFilter', false),
  withStyles(styles)
)(GraphStateless);
