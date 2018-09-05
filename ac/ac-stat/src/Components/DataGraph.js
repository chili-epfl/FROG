// @flow

import * as React from 'react';
import stats from 'statsjs';
import { withStyles } from '@material-ui/core/styles';

import Graph from './Graph';
import DataForm from './DataForm';
import FilteringPanel from './FilteringPanel';

const styles = {
  content: { display: 'flex', flex: '1 1 auto', maxHeight: '70%' }
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

  changeDataset = e => {
    this.props.logger({ type: 'change dataset', itemId: e.target.value });
    this.setState({ dataset: e.target.value, transformation: '' });
  };

  render() {
    const { activityData, data, dataFn, classes, axis, logger } = this.props;
    const { transformation, dataset } = this.state;
    const { originalData, ...datasets } = data;
    if (!data || Object.keys(data).length < 1) return <p>No data</p>;
    const dataTr = apply(transformation, datasets[dataset]);
    return (
      <div className={classes.content}>
        <DataForm
          changeDataset={this.changeDataset}
          data={dataTr}
          setTransformation={x => this.setState({ transformation: x })}
          transformation={transformation}
          editable={activityData.config.editable && transformation === ''}
          {...{ dataFn, originalData, logger, datasets, dataset }}
        />
        <Graph
          data={dataTr}
          config={activityData.config}
          {...{ axis, logger }}
        />
        <FilteringPanel
          data={dataTr}
          setTransformation={x => this.setState({ transformation: x })}
          {...{ transformation, logger, dataset }}
        />
      </div>
    );
  }
}

export default withStyles(styles)(DataGraph);
