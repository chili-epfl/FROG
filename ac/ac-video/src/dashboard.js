// @flow

import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { colorRange as color } from 'frog-utils';

export const mergeLog = (data: any, dataFn: any, log: any) => {
  if (log.payload) {
    const payload = { ...log.payload, updatedAt: log.updatedAt };
    Object.keys(payload).forEach(key => {
      if (data[log.userId]) {
        dataFn.objInsert(payload[key], [log.userId, key]);
      } else {
        dataFn.objInsert({ [key]: payload[key] }, log.userId);
      }
    });
  }
};

export const initData = {};

const VideoProgress = ({ data, user }) => {
  let backgroundColor;
  let bsStyle;

  if (data.paused) {
    bsStyle = 'warning';
    backgroundColor = color(data.updatedAt);
  }

  if (data.ended) {
    bsStyle = 'danger';
  }

  return (
    <div className="container-fluid">
      <h4
        style={{
          float: 'left',
          width: '5em'
        }}
      >
        {user}
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

class Viewer extends Component {
  state: Object;
  interval: any;
  unmounted: boolean;

  constructor(props: any) {
    super(props);
    this.state = { unmounted: false };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      if (!this.unmounted) {
        this.forceUpdate();
      }
    }, 2000);
  }

  componentWillUnmount() {
    this.unmounted = true;
    window.clearInterval(this.interval);
  }

  render() {
    if (!this.props.data) {
      return null;
    }
    return (
      <div>
        {Object.keys(this.props.data).map(x =>
          <VideoProgress
            data={this.props.data[x]}
            user={this.props.users[x]}
            key={x}
          />
        )}
      </div>
    );
  }
}

export default {
  Viewer,
  mergeLog,
  initData
};
