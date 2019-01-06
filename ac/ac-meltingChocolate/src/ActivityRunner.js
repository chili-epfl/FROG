// @flow

import * as React from 'react';
import { type ActivityRunnerT } from 'frog-utils';
import html2canvas from 'html2canvas';
import Canvas2Buffer from 'canvas-to-buffer';
import AddAPhoto from '@material-ui/icons/AddAPhoto';
import { Fab } from '@material-ui/core';

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

  onEvent = e => {
    if (e.data) {
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
    // eslint-disable-next-line
    html2canvas(
      // $FlowFixMe
      document.getElementById('ac-chocolate').contentDocument.body
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
        <div>
          {this.props.activityData.config.screenshot && (
            <Fab color="primary" onClick={this.screenshot}>
              <AddAPhoto />
            </Fab>
          )}
        </div>
        <iframe
          id="ac-chocolate"
          style={{ width: '600px', height: '600px' }}
          title="ac-thermoCup"
          src={`/clientFiles/ac-meltingChocolate/index.html?mode=${
            this.props.activityData.config?.mode
          }`}
        />
      </div>
    );
  }
}

export default (ActivityRunner: ActivityRunnerT);
