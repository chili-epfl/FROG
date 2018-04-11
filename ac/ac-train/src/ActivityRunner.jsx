import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import { ProgressBar } from 'react-bootstrap';
import { shuffle } from 'lodash';
import { SpecificGuideline } from './Guidelines';
import { styles, texts } from './ActivityUtils';
import Interface from './Interface';

const Main = props => {
  // const interfaces = [
  //   'start',
  //   ...shuffle(['graphical', 'dragdrop', 'command', 'form'])
  // ];

  const interfaces = ['start', ...shuffle(['command'])];

  const start = () => {
    const { dataFn } = props;
    dataFn.objInsert(false, 'guidelines');
  };

  const beginActivity = () => {
    const { dataFn } = props;
    dataFn.numIncr(1, 'step');
  };

  const { step, guidelines } = props.data;

  if (guidelines) {
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
      <ProgressBar now={p} label={`${p}%`} />
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
