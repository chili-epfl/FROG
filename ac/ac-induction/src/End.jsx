// @flow

import React, { Component } from 'react';

export default class End extends Component {
  componentWillMount() {
    this.props.dataFn.objDel({}, ['feedbackOpen']);
    this.props.dataFn.objDel({}, ['testChoice']);
  }

  render() {
    return (
      <div style={{ margin: '50px' }}>
        <h2>End of the activity</h2>
        {this.props.data.parts.includes('Tests with feedback') && (
          <Result
            title="Tests with feedback"
            list={this.props.data.listIndexTestWithFeedback}
          />
        )}
        {this.props.data.parts.includes('Tests') && (
          <Result title="Tests" list={this.props.data.listIndexTest} />
        )}
      </div>
    );
  }
}

const Result = ({ title, list }: Object) => (
  <div style={{ display: 'flex', flexDirection: 'row', margin: '10px' }}>
    <div style={{ width: '150px' }}>{title}</div>
    {list.map((x, i) => (
      <div
        key={x + i.toString()}
        style={{
          width: 400 / list.length + 'px',
          height: '30px',
          backgroundColor:
            x.correction.result === 0
              ? '#00CC00'
              : x.correction.result === 1 ? '#FF9933' : '#CC0000',
          border: 'solid black 1px',
          textAlign: 'center'
        }}
      >
        {i}
      </div>
    ))}
  </div>
);
