// @flow
import * as React from 'react';
import seededShuffle from 'seededshuffle';
import { type ActivityRunnerPropsT } from 'frog-utils';

import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

import { SpecificGuideline } from './Guidelines';
import Interface from './Interface';

const styles = {
  main: {
    width: '100%',
    height: '100%'
  },
  container: {
    padding: '40px',
    height: '100%'
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

type PropsT = {
  dataFn: any,
  data: Object,
  activityData: { config: Object },
  userInfo: { id: string }
};

class Main extends React.Component<PropsT> {
  interfaces: Array<string>;

  start = () => {
    const { dataFn } = this.props;
    dataFn.objInsert(false, 'guidelines');
  };

  beginActivity = () => {
    const { dataFn } = this.props;
    dataFn.numIncr(1, 'step');
  };

  componentWillMount() {
    const { userInfo } = this.props;

    const shuffledInterfaces = seededShuffle.shuffle(
      ['dragdrop', 'form', 'command', 'graphical'],
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
const RunnerController = (
  props: ActivityRunnerPropsT & { classes: Object }
) => {
  const {
    data: { iteration },
    activityData: {
      config: { iterationPerInterface }
    },
    classes
  } = props;

  const p = Math.round(iteration / (4 * iterationPerInterface) * 100);
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
        <Main {...props} />
      </div>
    </div>
  );
};

const StyledRunner = withStyles(styles)(RunnerController);

export default class ActivityRunner extends React.Component<
  ActivityRunnerPropsT
> {
  render() {
    return this.props.data && <StyledRunner {...this.props} />;
  }
}
