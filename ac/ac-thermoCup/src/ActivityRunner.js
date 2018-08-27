// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import html2canvas from 'html2canvas';
import Canvas2Buffer from 'canvas-to-buffer';
import { throttle } from 'lodash';

// the actual component that the student sees
class ActivityRunner extends React.Component<*, *> {
  iframe: any;
  constructor(props) {
    super(props);
    this.iframe = React.createRef();
  }
  componentDidMount = () => {
    window.addEventListener('message', this.onEvent);
  };

  logDist = msg => {
    this.props.stream({
      trace: msg.trial?.name,
      y: msg['thermometer0-temperature']
    });
  };

  logDistThrottled = throttle(this.logDist, 500);

  onEvent = e => {
    if (e.data) {
      if (e.data.type === 'frog-data') {
        this.logDistThrottled(e.data.msg);
      }
      if (e.data.type === 'wise-log') {
        this.props.logger(e.data.payload);
      } else if (e.data.messageType === 'studentDataChanged') {
        this.props.dataFn.objInsert(e.data.studentData);
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener('message', this.onEvent);
  }

  screenshot = () => {
    html2canvas(
      // $FlowFixMe
      document.getElementById('ac-thermoCup').contentDocument.body
    ).then(canvas => {
      const c = new Canvas2Buffer(canvas, { image: { types: ['jpeg'] } });
      this.props.dataFn.createLIPayload('li-file', c.toBuffer(), true, {
        user: this.props.userInfo.name
      });
    });
  };

  render() {
    return (
      <div>
        {this.props.activityData.config.screenshot && (
          <button onClick={this.screenshot}>Screenshot</button>
        )}
        <iframe
          id="ac-thermoCup"
          style={{ width: '600px', height: '600px' }}
          title="ac-thermoCup"
          src="/clientFiles/ac-thermoCup/ThermoChallenge_oneLayer.html"
        />
      </div>
    );
  }
}

export default (ActivityRunner: ActivityRunnerT);
