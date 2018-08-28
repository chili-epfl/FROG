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
    this.state = { dataset: 0 };
  }

  render() {
    const { activityData, data, dataFn, classes } = this.props;
    console.log(data);
    if (!data || Object.keys(data).length < 1) return <div />;
    return (
      <>
        {Object.keys(data).length > 1 && (
          <Select
            value={this.state.dataset}
            onChange={e => this.setState({ dataset: e.target.value })}
            classes={{ root: classes.root }}
          >
            {Object.keys(data).map((name, index) => (
              <MenuItem value={index} key={name} selected>
                {name}
              </MenuItem>
            ))}
          </Select>
        )}
        <div style={{ display: 'flex', height: 'inherit' }}>
          <DataForm
            data={Object.values(data)[this.state.dataset]}
            {...{ dataFn }}
            dataset={Object.keys(data)[this.state.dataset]}
          />
          <div
            style={{
              width: '1px',
              height: 'inherit',
              backgroundColor: '#000000'
            }}
          />
          <Graph
            data={Object.values(data)[this.state.dataset]}
            config={activityData.config}
          />
        </div>
      </>
    );
  }
}

export default withStyles(styles)(DataGraph);
