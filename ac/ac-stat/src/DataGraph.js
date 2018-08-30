// @flow

import * as React from 'react';
import * as math from 'mathjs';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Graph from './Graph';
import DataForm from './DataForm';

const styles = {
  root: {
    width: '150px',
    height: 'fit-content'
  }
};

const apply = (transfo: string, data: Array<Object>) => {
  const mean = math.mean(data.map(e => Object.values(e)[0]));
  switch (transfo) {
    case 'log':
      return data.filter(e => Number(Object.values(e)[0]) > 0).map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] = Math.log(Object.values(entry)[0]);
        return newEntry;
      });
    case 'exp':
      return data.map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] = Math.exp(Object.values(entry)[0]);
        return newEntry;
      });
    case 'sqrt':
      return data.filter(e => Number(Object.values(e)[0]) > 0).map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] = Math.sqrt(Object.values(entry)[0]);
        return newEntry;
      });
    case 'x100':
      return data.map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] = Object.values(entry)[0] * 100;
        return newEntry;
      });
    case '+50':
      return data.map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] = Object.values(entry)[0] + 50;
        return newEntry;
      });
    case '11x-10E[x]':
      return data.map(entry => {
        const newEntry = { ...entry };
        newEntry[Object.keys(entry)[0]] =
          11 * Object.values(entry)[0] - 10 * mean;
        return newEntry;
      });
    case 'outliers':
      return data.reduce((acc, cur) => [...acc, cur], []);
    default:
      return data;
  }
};

class DataGraph extends React.Component<*, *> {
  constructor(props: Object) {
    super(props);
    this.state = {
      dataset: 0,
      transformation: ''
    };
  }

  render() {
    const { activityData, data, dataFn, classes } = this.props;
    const { originalData, ...datasets } = data;
    if (!data || Object.keys(data).length < 1) return <div />;
    const dataTr = apply(
      this.state.transformation,
      Object.values(datasets)[this.state.dataset]
    );
    return (
      <>
        {Object.keys(datasets).length > 1 && (
          <Select
            value={this.state.dataset}
            onChange={e =>
              this.setState({ dataset: e.target.value, transformation: '' })
            }
            classes={{ root: classes.root }}
          >
            {Object.keys(datasets).map((name, index) => (
              <MenuItem value={index} key={name} selected>
                {name}
              </MenuItem>
            ))}
          </Select>
        )}
        <div
          style={{ display: 'flex', height: 'fit-content', marginTop: '10px' }}
        >
          <DataForm
            data={dataTr}
            {...{ dataFn, originalData }}
            dataset={Object.keys(datasets)[this.state.dataset]}
            setTransformation={x => this.setState({ transformation: x })}
            transformation={this.state.transformation}
            editable={
              activityData.config.editable && this.state.transformation === ''
            }
          />
          <div
            style={{
              width: '1px',
              height: 'inherit',
              backgroundColor: '#000000'
            }}
          />
          <Graph data={dataTr} config={activityData.config} />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(DataGraph);
