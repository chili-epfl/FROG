// @flow

import * as React from 'react';
import { shuffle } from 'lodash';
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
  }
};

// console.log(interfaces);

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
  data: Object
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
    this.interfaces = [
      'start',
      ...shuffle(['dragdrop', 'form', 'command', 'graphical'])
    ];
  }

  render() {
    const { step, guidelines } = this.props.data;

    if (step < 5 && guidelines) {
      return (
        <SpecificGuideline
          activity={this.interfaces[step]}
          start={step === 0 ? this.beginActivity : this.start}
          step={step}
        />
      );
    }

    if (step < 5) {
      return <Interface activity={this.interfaces[step]} {...this.props} />;
    } else {
      return <ActivityEnded />;
    }
  }
}

// the actual component that the student sees
const RunnerController = (
  props: ActivityRunnerPropsT & { classes: Object }
) => {
  const {
    data: { step },
    classes
  } = props;
  const p = Math.round(step / 5 * 100);
  return (
    <div className={classes.main}>
      <LinearProgress variant="determinate" color="secondary" value={p} />
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
