// @flow

import * as React from 'react';
import DataForm from './DataForm'
import Graph from './Graph'


type StateT = {
  data: Object[]
}

// the actual component that the student sees
export default class ActivityRunner extends React.Component<ActivityRunnerPropsT, StateT> {
  constructor(props){
    // const { logger, activityData, data, dataFn, userInfo, classes } = props
    super(props)
    this.state = {
      data : [
          {
          x: [0, 1, 3, 6, 10],
          y: [12,23,34,45,47]
        }
      ]
    }
  }

  render(){
    return (
    <div style={{display: 'flex'}}>
      <DataForm data={this.state.data} setData={x => this.setState(x)}/>
      <Graph data={this.state.data}/>
    </div>
  );
  }
}
