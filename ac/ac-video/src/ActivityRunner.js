import * as React from 'react';
import ReactPlayer from 'react-player';
import { type ActivityRunnerPropsT } from 'frog-utils';

class ActivityRunner extends React.Component<ActivityRunnerPropsT> {
  ref: any;
  componentDidMount() {
    this.ref.seekTo(this.props.data.play);
  }
  render() {
    const { activityData, logger, dataFn } = this.props;
    const url = activityData.config.url;
    return (
      <ReactPlayer
        ref={ref => (this.ref = ref)}
        url={url}
        playing={activityData.config.playing}
        controls
        loop={activityData.config.loop}
        onStart={() => logger({ type: 'start', itemId: url })}
        onPause={() => logger({ type: 'pause', itemId: url })}
        onPlay={() => logger({ type: 'play', itemId: url })}
        onEnded={() => logger({ type: 'finishPlaying', itemId: url })}
        onProgress={x => {
          logger({
            type: 'videoProgress',
            value: x.played,
            itemId: url
          });
          dataFn.objInsert({ play: x.playedSeconds });
        }}
        width="100%"
        height="100%"
      />
    );
  }
}

export default ActivityRunner;
