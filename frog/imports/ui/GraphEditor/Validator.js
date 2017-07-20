// @flow

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Activities, Operators, Connections } from '../../api/activities';
import valid from '../../api/validGraphFn';

const ListError = props =>
  <g>
    {props.vect.map((x, i) => {
      const k = i * 2;
      return (
        <text x="90" y={40 + 20 * i} key={x.id + k}>
          {' '}{'• ' + x.err}{' '}
        </text>
      );
    })}
  </g>;

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
    return (
      <svg width="34px" height="34px" style={{ overflow: 'visible' }}>
        <circle
          cx="17"
          cy="17"
          r="12"
          stroke="transparent"
          fill={v.length ? 'red' : 'green'}
          onMouseOver={() => {
            if (!this.state.over) this.setState({ over: true });
          }}
          onMouseOut={() => {
            if (this.state.over) this.setState({ over: false });
          }}
        />
        {this.state.over &&
          v.length > 0 &&
          <g>
            <rect
              x="80"
              y="20"
              rx="20"
              ry={5 + 5 * v.length}
              width={
                8 *
                v.map(x => x.err.length).reduce((acc, x) => (x > acc ? x : acc))
              }
              height={5 + 22 * v.length}
              fill="#FFFFFF"
              stroke="#CA1A1A"
            />
            <ListError vect={v} />
          </g>}
      </svg>
    );
  }
  /*
    return (
      <svg>
        <circle
          cx="35"
          cy="15"
          r="10"
          stroke="transparent"
          fill={v.length ? 'red' : 'green'}
          onMouseOver={() => {
            if (!this.state.over) this.setState({ over: true });
          }}
          onMouseOut={() => {
            if (this.state.over) this.setState({ over: false });
          }}
        />
        {this.state.over &&
          v.length > 0 &&
          <g>
            <rect
              x="80"
              y="20"
              rx="20"
              ry={5 + 5 * v.length}
              width={
                8 *
                v.map(x => x.err.length).reduce((acc, x) => (x > acc ? x : acc))
              }
              height={5 + 22 * v.length}
              fill="#FFFFFF"
              stroke="#CA1A1A"
            />
            <ListError vect={v} />
          </g>}
      </svg>
    );
  }
  */
}

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
  <ValidCC graphId={graphId} />
);
