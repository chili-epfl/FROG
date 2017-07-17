// @flow

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Activities, Operators, Connections } from '../../api/activities';
import valid from '../../api/validGraphFn';
import { activityTypes } from '../../activityTypes';
import { operatorTypes } from '../../operatorTypes';

const listError = props => props.v.map(x => <li>{x}</li>);

class Validator extends Component {
  state: { over: boolean };

  constructor(props) {
    super(props);
    this.state = { over: false };
  }

  render() {
    const v = valid(
      this.props.activities,
      this.props.operators,
      this.props.connections
    );
    // console.log(a+' '+o+ ' '+c);
    return (
      <svg>
        <circle
          cx="35"
          cy="35"
          r="30"
          stroke="transparent"
          fill={v.length ? 'red' : 'green'}
          onMouseOver={e => {
            if (!this.state.over) this.setState({ over: true });
          }}
          onMouseOut={e => {
            if (this.state.over) this.setState({ over: false });
          }}
        />
        {this.state.over &&
          <rect x="90" y="20" width="400" height="200" fill={'white'} />}
        }
      </svg>
    );
  }
}
//        <ul x="100" y="30" fill="black"> {listError}</ul>

const ValidCC = createContainer(
  props => ({
    acts: Activities.find({ graphId: props.graphId }).fetch(),
    ops: Operators.find({ graphId: props.graphId }).fetch(),
    cons: Connections.find({ graphId: props.graphId }).fetch()
  }),
  props =>
    <Validator
      activities={props.acts}
      operators={props.ops}
      connections={props.cons}
    />
);

export default connect(({ store: { graphId } }) =>
  <ValidCC graphId={graphId} props />
);
