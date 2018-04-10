// @flow

import * as React from 'react';
import { withState, compose } from 'recompose';

import Preview from './Preview';
import { activityTypesObj } from '../../activityTypes';

export const ModalPreview = compose(
  withState('fullWindow', 'setFullWindow', false),
  withState('showData', 'setShowData', false),
  withState('showDash', 'setShowDash', false),
  withState('showDashExample', 'setShowDashExample', false),
  withState('windows', 'setWindows', 1),
  withState('showLogs', 'setShowLogs', false),
  withState('users', 'setUsers', ['Chen Li']),
  withState('instances', 'setInstances', ['Chen Li']),
  withState('plane', 'setPlane', 1),
  withState('reloadAPIform', 'setReloadAPIform', undefined),
  withState('example', 'setExample', 0),
  withState('config', 'setConfig', undefined)
)((props: Object) => {
  const { config, _config, activityTypeId, example } = props;
  if (!config) {
    if (_config) {
      props.setConfig(_config);
    } else {
      const aT = activityTypesObj[activityTypeId];
      const exConfig = aT.meta.exampleData[example].config;
      props.setConfig(exConfig);
    }
  }
  return <Preview modal {...props} />;
});

class PreviewPage extends React.Component<any, any> {
  setStates: { [state: string]: Function };

  constructor(props: Object) {
    super(props);
    const statedump = localStorage.getItem('previewstate');
    if (statedump) {
      this.state = JSON.parse(statedump);
    } else {
      this.state = {
        example: -1,
        fullWindow: false,
        showData: false,
        showDash: false,
        showDashExample: false,
        showLogs: false,
        users: ['Chen Li'],
        instances: ['Chen Li'],
        plane: 1,
        config: {},
        activityTypeId: null,
        reloadAPIform: ''
      };
    }
    this.setStates = {
      setExample: example => this.setState({ example }),
      setFullWindow: fullWindow => this.setState({ fullWindow }),
      setShowData: showData => this.setState({ showData }),
      setShowDash: showDash => this.setState({ showDash }),
      setShowDashExample: showDashExample => this.setState({ showDashExample }),
      setShowLogs: showLogs => this.setState({ showLogs }),
      setUsers: users => this.setState({ users }),
      setInstances: instances => this.setState({ instances }),
      setPlane: plane => this.setState({ plane }),
      setConfig: config => this.setState({ config }),
      setActivityTypeId: activityTypeId => this.setState({ activityTypeId }),
      setReloadAPIform: reloadAPIform => this.setState({ reloadAPIform })
    };
  }

  render() {
    localStorage.setItem('previewstate', JSON.stringify(this.state));
    return <Preview {...{ ...this.state, ...this.setStates }} />;
  }
}

PreviewPage.displayName = 'PreviewPage';

export default PreviewPage;
