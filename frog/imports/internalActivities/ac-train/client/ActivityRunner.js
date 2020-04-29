// @flow

import * as React from 'react';
import seededShuffle from 'seededshuffle';
import { type ActivityRunnerPropsT } from '/imports/frog-utils';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import { SpecificGuideline } from './Guidelines';
import Interface from './Interface';
import mergeLog from '../mergeLog';

const styles = {
  main: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  },
  container: {
    padding: '40px',
    flex: 1,
    overflow: 'auto'
  },
  progressBarHeight: { height: '12px' },
  progressBarColor: { backgroundColor: '#F45B69' },
  progressBarBGColor: {
    backgroundColor: '#ffbec7'
  }
};

const ActivityEnded = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      position: 'relative'
    }}
  >
    <iframe
      title="thank"
      src="https://giphy.com/embed/l3q2wJsC23ikJg9xe"
      width="100%"
      height="60%"
      style={{ position: 'absolute', pointerEvents: 'none', border: 'none' }}
      allowFullScreen
    />
  </div>
);

// $FlowFixMe
class Main extends React.Component<ActivityRunnerPropsT & { classes: any }> {
  interfaces: Array<string>;

  start = () => {
    const { dataFn } = this.props;
    dataFn.objInsert(false, 'guidelines');
  };

  beginActivity = () => {
    const { dataFn } = this.props;
    dataFn.numIncr(1, 'step');
  };

  // eslint-disable-next-line
  componentWillMount() {
    const { userInfo } = this.props;

    const shuffledInterfaces = seededShuffle.shuffle(
      ['dragdrop', 'form', 'command', 'map'],
      userInfo.id
    );

    this.interfaces = ['start', ...shuffledInterfaces];
  }

  render() {
    const {
      data: { step, guidelines },
      activityData: { config }
    } = this.props;

    if (config.interface) {
      return <Interface whichInterface={config.interface} {...this.props} />;
    }

    if (step < 5) {
      if (guidelines) {
        return (
          <SpecificGuideline
            whichInterface={this.interfaces[step]}
            start={step === 0 ? this.beginActivity : this.start}
            step={step}
          />
        );
      }

      return (
        <Interface whichInterface={this.interfaces[step]} {...this.props} />
      );
    }

    return <ActivityEnded />;
  }
}

// the actual component that the student sees
const RunnerController = props => {
  const {
    data: { iteration },
    activityData: {
      config: { iterationPerInterface }
    },
    classes
  } = props;
  const logger = rawLog => {
    const logs = Array.isArray(rawLog) ? rawLog : [rawLog];
    logs.forEach(msg =>
      mergeLog(props.data, props.dataFn, msg, props.activityData.config)
    );
    props.logger(rawLog);
  };

  const p = Math.round((iteration / (4 * iterationPerInterface)) * 100);
  return (
    <div className={classes.main}>
      <LinearProgress
        variant="determinate"
        value={p}
        classes={{
          root: classes.progressBarHeight,
          barColorPrimary: classes.progressBarColor,
          colorPrimary: classes.progressBarBGColor
        }}
      />
      <div className={classes.container}>
        <Main {...{ ...props, logger }} />
      </div>
    </div>
  );
};

const StyledRunner = withStyles(styles)(RunnerController);

const ActivityRunner = (props: ActivityRunnerPropsT) =>
  props.data && <StyledRunner {...props} />;

export default ActivityRunner;
