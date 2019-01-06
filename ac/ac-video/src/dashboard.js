// @flow

import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import { set } from 'lodash';

import { colorRange as color, type LogDbT } from 'frog-utils';

const styles = () => ({
  main: {
    display: 'flex',
    flexDirection: 'column'
  },
  individualProgress: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 4,
    width: 'calc(100% - 16px)',
    borderRadius: 8,
    padding: 4
  },
  userName: {
    float: 'left',
    width: '5em'
  },
  timeLabel: {
    position: 'absolute',
    marginLeft: 'calc(5em + 5px)',
    color: 'white',
    zIndex: 1
  },
  progressBar: {
    flex: 1,
    height: 20
  },
  barColorBlue: {
    backgroundColor: '#55b'
  },
  barColorYellow: {
    backgroundColor: '#f4df42'
  },
  barColorRed: {
    backgroundColor: '#b55'
  }
});

export const mergeLog = (state: any, log: LogDbT) => {
  const path = log.type === 'videoProgress' ? 'playing' : 'state';
  const value = log.type === 'videoProgress' ? log.value : log.type;
  set(state, [log.userId, path], value);
  if (log.type === 'pause') {
    set(state, [log.userId, 'pausedAt'], log.timestamp);
  }
};

export const initData = {};

const VideoProgress = withStyles(styles)(({ state, user, classes }) => {
  const backgroundColor =
    state.state === 'pause' ? color(state.pausedAt) : '#bbe';
  const barColor =
    state.state === 'pause'
      ? 'barColorYellow'
      : state.state === 'finishPlaying'
      ? 'barColorRed'
      : 'barColorBlue';
  const progress = Math.round((state.playing || 0) * 1000) / 10;

  return (
    <div className={classes.individualProgress}>
      <h4 className={classes.userName}>{user}</h4>
      <span className={classes.timeLabel}>{progress}</span>
      <LinearProgress
        variant="determinate"
        className={classes.progressBar}
        value={progress}
        style={{ backgroundColor }}
        classes={{ barColorPrimary: classes[barColor] }}
      />
    </div>
  );
});

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
    const { classes, state } = this.props;
    if (!state) return null;
    return (
      <div className={classes.main}>
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

const StyledViewer = withStyles(styles)(Viewer);

export default {
  video: {
    Viewer: StyledViewer,
    mergeLog,
    initData
  }
};
