// @flow

import React, { Component } from 'react';
import type { ActivityPackageT } from 'frog-utils';
import { H5PIframePrepare } from '/imports/ui/App/h5p';
import ConfigComponent from './ConfigComponent';
import dashboard from './Dashboard';

export const meta = {
  name: 'H5P activity',
  shortDesc: 'Upload a fully configured H5P activity',
  description: 'Displays H5P activity, and logs xAPI statements'
};

export class ActivityRunner extends Component {
  componentDidMount = () => {
    H5PIframePrepare();
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
        e.data.id === this.props.activityData.config.component.fileId
      ) {
        this.props.logger({
          type:
            (e.data.msg.verb && e.data.msg.verb.display['en-US']) || 'h5p-xapi',
          payload: { msg: JSON.stringify(e.data.msg) }
        });
      }
    });
  };

  componentWillUnmount = () => {};

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        {this.props.activityData.config.prompt && (
          <h1>{this.props.activityData.config.prompt}</h1>
        )}
        <iframe
          title="IFrame"
          src={'/h5p/' + this.props.activityData.config.component.fileId}
          style={{ width: '100%', height: '100%', overflow: 'auto' }}
        />
      </div>
    );
  }
}

export default ({
  id: 'ac-h5p',
  type: 'react-component',
  ActivityRunner,
  ConfigComponent,
  dashboard,
  config: {
    type: 'object',
    required: ['component'],
    properties: {
      prompt: { type: 'string', title: 'Prompt' },
      component: {
        type: 'object',
        title: 'H5P file',
        required: ['fileId'],
        properties: { fileId: { type: 'string', title: 'H5P file' } }
      }
    }
  },
  meta
}: ActivityPackageT);
