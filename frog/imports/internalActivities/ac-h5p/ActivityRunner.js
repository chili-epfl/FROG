import * as React from 'react';
import type { ActivityRunnerPropsT } from 'frog-utils';
import { H5PIframePrepare } from '/imports/ui/App/h5p';

export class ActivityRunner extends React.Component<
  ActivityRunnerPropsT,
  void
> {
  componentDidMount = () => {
    if (!this.props.activityData.config.component) {
      return null;
    }
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
    if (!this.props.activityData.config.component) {
      return null;
    }
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

export default ActivityRunner;
