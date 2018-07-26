// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import html2canvas from 'html2canvas';

// the actual component that the student sees
class ActivityRunner extends React.Component<*, *> {
  constructor(props) {
    super(props);
    this.iframe = React.createRef();
  }
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

  screenshot = () => {
    html2canvas(
      document.getElementById('ac-thermoCup').contentDocument.body
    ).then(canvas => {
      document.body.appendChild(canvas);
      this.props.dataFn.createLIPayload('li-file', canvas.toBuffer(), true);
      console.log(canvas);
    });
  };

  render() {
    return (
      <div>
        <button onClick={this.screenshot}>Screenshot</button>
        <iframe
          id="ac-thermoCup"
          style={{ width: '600px', height: '600px' }}
          title="ac-thermoCup"
          src="/file?name=ac/ac-thermoCup/ThermoChallenge_oneLayer.html"
        />
      </div>
    );
  }
}

export default (ActivityRunner: ActivityRunnerT);
