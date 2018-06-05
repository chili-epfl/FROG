// @flow

import * as React from 'react';
import { defaultConfig, uuid } from 'frog-utils';
import { omit } from 'lodash';

import Preview from './Preview';
import { getUserId } from './Controls';
import ErrorWrapper from './ErrorWrapper';
import { initActivityDocuments } from './Content';
import { initDashboardDocuments } from './dashboardInPreviewAPI';
import { activityTypesObj } from '../../activityTypes';

export const addDefaultExample = (activityType: Object) => [
  {
    title: 'Default config',
    data: undefined,
    config: defaultConfig(activityType),
    type: undefined
  },
  ...(activityType.meta.exampleData || [])
];

const defaultState = {
  example: 0,
  fullWindow: false,
  reloadActivity: uuid(),
  showData: false,
  showDash: false,
  showDashExample: false,
  showLogs: false,
  users: ['Chen Li'],
  instances: [getUserId('Chen Li')],
  plane: 1,
  config: {},
  activityTypeId: null,
  reloadAPIform: ''
};

class PreviewPage extends React.Component<any, any> {
  setStates: { [state: string]: Function };

  constructor(props: Object) {
    super(props);
    if (this.props.modal) {
      this.state = {
        ...defaultState,
        activityTypeId: this.props.activityTypeId,
        config: { ...this.props.config },
        modal: true,
        dismiss: this.props.dismiss,
        reloadActivity: uuid(),
        metadatas: { uuid: '', title: '', description: '', tags: [] }
      };
      if (!this.state.activityTypeId) {
        return null;
      }
      const activityType = activityTypesObj[this.state.activityTypeId];

      initActivityDocuments(
        this.state.instances,
        activityType,
        this.state.example,
        this.state.config,
        true
      );
      // resets the reactive documents for the dashboard
      initDashboardDocuments(activityType, true);
    } else {
      const statedump = sessionStorage.getItem('previewstate');
      let state;
      if (statedump) {
        try {
          state = JSON.parse(statedump);
        } catch (e) {
          console.warn('Could not parse sessionStorage', statedump, e);
        }
      }
      if (state && state.activityTypeId) {
        const activityType = activityTypesObj[state.activityTypeId];
        this.state = state;
        initActivityDocuments(
          state.instances,
          activityType,
          state.example,
          state.config,
          true
        );
        // resets the reactive documents for the dashboard
        initDashboardDocuments(activityType, true);
      } else {
        this.state = defaultState;
      }
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
      setReloadActivity: reloadActivity => this.setState({ reloadActivity }),
      setPlane: plane => this.setState({ plane }),
      setConfig: config => this.setState({ config }),
      setReloadAPIform: reloadAPIform => this.setState({ reloadAPIform }),
      setMetadatas: metadatas => this.setState({ metadatas }),
      setActivityTypeId: activityTypeId => {
        if (!(activityTypesObj[activityTypeId]?.meta?.preview === false)) {
          this.setState({ activityTypeId });
        }
      }
    };
  }

  render() {
    if (!this.props.modal) {
      sessionStorage.setItem(
        'previewstate',
        JSON.stringify(omit(this.state, 'modal'))
      );
    }
    return <Preview {...{ ...this.state, ...this.setStates }} />;
  }
}

PreviewPage.displayName = 'PreviewPage';

export default (props: any) => (
  <ErrorWrapper>
    <PreviewPage {...props} />
  </ErrorWrapper>
);
