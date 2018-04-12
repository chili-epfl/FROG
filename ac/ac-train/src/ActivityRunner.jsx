import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { LinearProgress } from 'material-ui/Progress';
import { shuffle } from 'lodash';
import { SpecificGuideline } from './Guidelines';
import { styles, texts } from './ActivityUtils';
import Interface from './Interface';

const interfaces = [
  'start',
  ...shuffle(['graphical', 'dragdrop', 'command', 'form'])
];

// const interfaces = ['start', ...shuffle(['graphical'])];

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
    return <div style={styles.text}>{texts.end}</div>;
  }
};

// the actual component that the student sees
const Runner = (props: ActivityRunnerT) => {
  const { step } = props.data;
  const p = Math.round(step / 5 * 100);
  return (
    <div style={styles.main}>
      <LinearProgress variant="determinate" color="secondary" value={p} />
      <div style={styles.container}>
        <Main {...props} />
      </div>
    </div>
  );
};

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  render() {
    return this.props.data && <Runner {...this.props} />;
  }
}
