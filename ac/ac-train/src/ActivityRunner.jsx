// @flow

import * as React from 'react';
import { shuffle } from 'lodash';
import { type ActivityRunnerT } from 'frog-utils';

import { withStyles } from 'material-ui/styles';
import { LinearProgress } from 'material-ui/Progress';

import { SpecificGuideline } from './Guidelines';
import { texts, testing } from './ActivityUtils';
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

let interfaces;

if (testing) {
  interfaces = ['start', ...shuffle(['form'])];
} else {
  interfaces = [
    'start',
    ...shuffle(['graphical', 'dragdrop', 'command', 'form'])
  ];
}

const Main = props => {
  const start = () => {
    const { dataFn } = props;
    dataFn.objInsert(false, 'guidelines');
  };

  const beginActivity = () => {
    const { dataFn } = props;
    dataFn.numIncr(1, 'step');
  };

  const { step, guidelines } = props.data;

  if (step < 5 && guidelines) {
    return (
      <SpecificGuideline
        activity={interfaces[step]}
        start={step === 0 ? beginActivity : start}
        step={step}
      />
    );
  }

  if (step < 5) {
    return <Interface activity={interfaces[step]} {...props} />;
  } else {
    return <div>{texts.end}</div>;
  }
};

// the actual component that the student sees
const RunnerController = (props: ActivityRunnerT) => {
  const { data: { step }, classes } = props;
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

const Runner = withStyles(styles)(RunnerController);

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
