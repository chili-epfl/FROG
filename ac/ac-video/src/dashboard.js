// @flow

import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { colorRange as color, type LogDbT } from 'frog-utils';
import { set } from 'lodash';

export const mergeLog = (state: any, log: LogDbT) => {
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
    set(state, [log.userId, path], value);
    if (log.type === 'pause') {
      set(state, [log.userId, 'pausedAt'], log.timestamp);
    }
  }
};

export const initData = {};

const VideoProgress = ({ state, user }) => {
  let backgroundColor;
  let bsStyle;

  if (state.state === 'pause') {
    bsStyle = 'warning';
    backgroundColor = color(state.pausedAt);
  }

  if (state.state === 'finishPlaying') {
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
        now={state.playing * 100}
        label={Math.round(state.playing * 1000) / 10}
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
    if (!this.props.state) {
      return null;
    }
    return (
      <div className="bootstrap">
        {Object.keys(this.props.state).map(x => (
          <VideoProgress
            state={this.props.state[x]}
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
