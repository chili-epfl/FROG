// @flow

import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { type ActivityRunnerT } from 'frog-utils';

import dashboard from './dashboard';

export const meta = {
  name: 'Video player',
  shortDesc: 'Video player',
  description:
    'Video player configurable with URL, and some settings (autoplay etc).',
  exampleData: [
    {
      title: 'Sample video',
      config: {
        url: 'https://www.youtube.com/watch?v=RHq6bEgeZD4',
        playing: true,
        loop: false
      },
      activityData: {}
    }
  ]
};

export const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'URL of video'
    },
    playing: {
      type: 'boolean',
      title: 'Should video begin auto-playing?',
      default: true
    },
    loop: {
      type: 'boolean',
      title: 'Should video loop?'
    }
  }
};

class Activity extends Component {
  ref: any;
  componentDidMount() {
    this.ref.seekTo(this.props.data.play);
  }
  render() {
    const { activityData, logger, dataFn } = this.props;
    return (
      <ReactPlayer
        ref={ref => (this.ref = ref)}
        url={activityData.config.url}
        playing={activityData.config.playing}
        controls
        loop={activityData.config.loop}
        onStart={() => logger({ paused: false, played: 0 })}
        onPause={() => logger({ paused: true })}
        onPlay={() => logger({ paused: false })}
        onEnded={() => logger({ ended: true })}
        onProgress={x => {
          logger({ ...x, ended: false });
          dataFn.objInsert({ play: x.playedSeconds });
        }}
        width="100%"
        height="100%"
      />
    );
  }
}

const ActivityRunner = (props: ActivityRunnerT) => <Activity {...props} />;

export default {
  id: 'ac-video',
  type: 'react-component',
  ActivityRunner,
  config,
  meta,
  dashboard
};
