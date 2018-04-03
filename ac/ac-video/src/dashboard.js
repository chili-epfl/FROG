// @flow

import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { colorRange as color, splitPathObject, type LogDBT } from 'frog-utils';

export const mergeLog = (data: any, dataFn: any, log: LogDBT) => {
  let path;
  let value;
  if (log.type === 'videoProgress') {
    path = 'playing';
    value = log.value;
  } else {
    path = 'state';
    value = log.type;
  }
  if (path) {
    const { insertObject, insertPath } = splitPathObject(
      data,
      [log.userId, path],
      value
    );
    dataFn.objInsert(insertObject, insertPath);
    if (log.type === 'pause') {
      dataFn.objInsert(log.timestamp, [log.userId, 'pausedAt']);
    }
  }
};

export const initData = {};

const VideoProgress = ({ data, user }) => {
  let backgroundColor;
  let bsStyle;

  if (data.state === 'pause') {
    bsStyle = 'warning';
    backgroundColor = color(data.pausedAt);
  }

  if (data.state === 'finishPlaying') {
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
        now={data.playing * 100}
        label={Math.round(data.playing * 1000) / 10}
        bsStyle={bsStyle}
        style={{ align: 'right', backgroundColor }}
      />
    </div>
  );
};

class Viewer extends Component<any, Object> {
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
        {Object.keys(this.props.data).map(x => (
          <VideoProgress
            data={this.props.data[x]}
            user={this.props.users[x] || x}
            key={x}
          />
        ))}
      </div>
    );
  }
}

export default {
  video: {
    Viewer,
    mergeLog,
    initData
  }
};
