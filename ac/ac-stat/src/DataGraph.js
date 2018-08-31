// @flow

import * as React from 'react';
import stats from 'statsjs';
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

const apply = (transfo: string, data: Object) => {
  const statArray = stats(data.values.map(e => e[0]));
  switch (transfo) {
    case 'log':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? Math.log(a) : a))
        )
      };
    case 'exp':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? Math.exp(a) : a))
        )
      };
    case 'sqrt':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? Math.sqrt(a) : a))
        )
      };
    case 'x100':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? a * 100 : a))
        )
      };
    case '+50':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? a + 50 : a))
        )
      };
    case '11x-10E[x]':
      return {
        columns: data.columns,
        values: data.values.map(entry =>
          entry.map((a, i) => (i === 0 ? 11 * a - 10 * statArray.mean() : a))
        )
      };
    case 'outliers':
      return {
        columns: data.columns,
        values: data.values.filter(
          entry => !statArray.findOutliers().arr.includes(entry[0])
        )
      };
    default:
      return data;
  }
};

class DataGraph extends React.Component<*, *> {
  constructor(props: Object) {
    super(props);
    this.state = {
      dataset: Object.keys(props.data).filter(ds => ds !== 'originalData')[0],
      transformation: ''
    };
  }

  render() {
    const { activityData, data, dataFn, classes, axis, logger } = this.props;
    const { originalData, ...datasets } = data;
    if (!data || Object.keys(data).length < 1) return <div />;
    const dataTr = apply(
      this.state.transformation,
      datasets[this.state.dataset]
    );
    return (
      <>
        {Object.keys(datasets).length > 1 && (
          <Select
            value={this.state.dataset}
            onChange={e => {
              logger({ type: 'change dataset', itemId: e.target.value });
              this.setState({ dataset: e.target.value, transformation: '' });
            }}
            classes={{ root: classes.root }}
          >
            {Object.keys(datasets).map(name => (
              <MenuItem value={name} key={name} selected>
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
            {...{ dataFn, originalData, logger }}
            dataset={this.state.dataset}
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
          <Graph
            data={dataTr}
            config={activityData.config}
            {...{ axis, logger }}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(DataGraph);
