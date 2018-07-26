// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';

// the actual component that the student sees
class ActivityRunner extends React.Component<*, *> {
  componentDidMount = () => {
    window.addEventListener('message', this.onEvent);
    console.log(this.props.data);
  };

  onEvent = e => {
    if (e.data) {
      if (e.data.type === 'wise-log') {
        this.props.logger(e.data.payload);
      } else if (e.data.messageType === 'studentDataChanged') {
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener('message', this.onEvent);
  }

  render() {
    return (
      <iframe
        style={{ width: '600px', height: '600px' }}
        title="ac-thermoCup"
        src="/file?name=ac/ac-thermoCup/ThermoChallenge_oneLayer.html"
      />
    );
  }
}

export default (ActivityRunner: ActivityRunnerT);
