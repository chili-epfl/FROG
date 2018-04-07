// @flow

import * as React from 'react';
import { toObject } from 'query-parse';
import { withRouter } from 'react-router';

import Preview from './Preview';

class PreviewPage extends React.Component<any, any> {
  setStates: { [state: string]: Function };

  constructor(props) {
    super(props);
    const { location: { search } } = props;
    const statedump = toObject(search.slice(1)).statedump;
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

  shouldComponentUpdate(nextProps, nextState) {
    const { history, location: { search } } = nextProps;
    const statedump = JSON.stringify(nextState);
    if (statedump !== toObject(search.slice(1)).statedump) {
      history.push(`/preview?statedump=${JSON.stringify(nextState)}`);
    }
    return true;
  }

  render() {
    return <Preview noModal {...{ ...this.state, ...this.setStates }} />;
  }
}

PreviewPage.displayName = 'PreviewPage';

export default withRouter(PreviewPage);
