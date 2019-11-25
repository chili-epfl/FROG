// @flow

import * as React from 'react';
import { defaultConfig, uuid } from '/imports/frog-utils';
import { isEmpty, omit } from 'lodash';

import { SimpleTopBar } from '/imports/containers/TopBarWrapper';
import Preview, { connection, restartBackend } from './Preview';
import { activityTypesObj } from '/imports/activityTypes';
import ErrorWrapper from './ErrorWrapper';
import { initActivityDocuments, DocId } from './Content';
import { initDashboardDocuments } from './dashboardInPreviewAPI';

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
  delay: false,
  example: 0,
  fullWindow: false,
  reloadActivity: uuid(),
  showData: false,
  showDash: false,
  showDashExample: false,
  showLogs: false,
  users: ['Chen Li'],
  instances: ['group1'],
  plane: 2,
  config: {},
  metadatas: { uuid: '', title: '', description: '', tags: [] },
  activityTypeId: null,
  reloadAPIform: ''
};

class PreviewPage extends React.Component<any, any> {
  setStates: { [state: string]: Function };

  constructor(props: Object) {
    super(props);

    restartBackend();
    if (this.props.graphEditor) {
      this.state = {
        ...defaultState,
        activityTypeId: this.props.activityTypeId,
        config: { ...this.props.config },
        graphEditor: true,
        dismiss: this.props.dismiss,
        reloadActivity: uuid()
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

    if (this.props.template && !isEmpty(this.props.template)) {
      const doc = connection.get(
        'rz',
        DocId(this.state.activityTypeId, this.state.instances[0])
      );
      doc.create(this.props.template.rz);
      if (this.props.template.lis) {
        Object.keys(this.props.template.lis).forEach(li => {
          const d = connection.get('li', li);
          d.create(this.props.template.lis[li]);
        });
      }
    }
    this.setStates = {
      setDelay: delay => this.setState({ delay }),
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
    if (!this.props.graphEditor) {
      sessionStorage.setItem(
        'previewstate',
        JSON.stringify(omit(this.state, 'modal'))
      );
    }
    return (
      <>
        {!this.props.graphEditor && <SimpleTopBar title="Advanced Preview" />}
        <Preview
          storeTemplateFn={this.props.storeTemplateFn}
          template={this.props.template}
          {...{ ...this.state, ...this.setStates }}
          config={this.props.config || this.state.config}
        />
      </>
    );
  }
}

PreviewPage.displayName = 'PreviewPage';

export default (props: any) => (
    <PreviewPage {...props} />
);
