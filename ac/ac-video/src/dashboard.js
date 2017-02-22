// @flow

import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { colorRange as color } from 'frog-utils';

const VideoProgress = ({ data }) => {
  let backgroundColor;
  let bsStyle;

  if (data.paused) {
    bsStyle = 'warning';
    backgroundColor = color(data.updated_at);
  }

  if (data.ended) {
    bsStyle = 'danger';
  }

  return (
    <div className="container-fluid">
      <h4
        style={{
          float: 'left',
          marginRight: '1em'
        }}
      >
        {data.username}
      </h4>
      <ProgressBar
        now={data.played * 100}
        label={Math.round(data.played * 1000) / 10}
        bsStyle={bsStyle}
        style={{ align: 'right', backgroundColor }}
      />
    </div>
  );
};

class Dash extends Component {
  state: Object;
  interval: any;

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.interval = setInterval(() => this.forceUpdate(), 2000);
  }

  componentWillUnmount() {
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <div>
        {this.props.logs.map(x => <VideoProgress data={x} key={x._id} />)}
      </div>
    );
  }
}

export default Dash;
