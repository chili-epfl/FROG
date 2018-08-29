// @flow

import * as React from 'react';
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

class DataGraph extends React.Component<*, *> {
  constructor(props: Object) {
    super(props);
    this.state = {
      dataset: 0,
      transformation: ''
    };
  } // apply the transformation

  render() {
    const { activityData, data, dataFn, classes } = this.props;
    const { originalData, ...datasets } = data;
    if (!data || Object.keys(data).length < 1) return <div />;
    return (
      <>
        {Object.keys(datasets).length > 1 && (
          <Select
            value={this.state.dataset}
            onChange={e => this.setState({ dataset: e.target.value })}
            classes={{ root: classes.root }}
          >
            {Object.keys(datasets).map((name, index) => (
              <MenuItem value={index} key={name} selected>
                {name}
              </MenuItem>
            ))}
          </Select>
        )}
        <div style={{ display: 'flex', height: 'fit-content' }}>
          <DataForm
            data={Object.values(datasets)[this.state.dataset]}
            {...{ dataFn, originalData }}
            dataset={Object.keys(datasets)[this.state.dataset]}
            setTransformation={x => this.setState({ transformation: x })}
            transformation={this.state.transformation}
          />
          <div
            style={{
              width: '1px',
              height: 'inherit',
              backgroundColor: '#000000'
            }}
          />
          <Graph
            data={Object.values(datasets)[this.state.dataset]}
            config={activityData.config}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(DataGraph);
