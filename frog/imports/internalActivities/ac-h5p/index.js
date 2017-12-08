// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import ConfigComponent from './ConfigComponent';

export const meta = {
  name: 'H5P activity',
  shortDesc: 'Upload a fully configured H5P activity',
  description: 'Displays H5P activity, and logs xAPI statements'
};

export class ActivityRunner extends Component {
  componentDidMount = () => {
    const eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    const eventer = window[eventMethod];
    const messageEvent =
      eventMethod === 'attachEvent' ? 'onmessage' : 'message';
    eventer(messageEvent, e => {
      if (
        e.data &&
        e.data.type === 'h5p-log' &&
        e.data.id === this.props.activityData.config.fileId
      ) {
        this.props.logger({
          type:
            (e.data.msg.verb && e.data.msg.verb.display['en-US']) || 'h5p-xapi',
          payload: JSON.stringify(e.data.msg.result)
        });
      }
    });
  };

  componentWillUnmount = () => {};

  render() {
    return (
      <iframe
        title="IFrame"
        src={'/h5p/' + this.props.activityData.config.fileId}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      />
    );
  }
}

export default {
  id: 'ac-h5p',
  type: 'react-component',
  ActivityRunner,
  ConfigComponent,
  config: {},
  meta
};
