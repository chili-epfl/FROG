// @flow

import * as React from 'react';
import { Provider } from 'mobx-react';
import Mousetrap from 'mousetrap';
import { withRouter } from 'react-router';
import { Meteor } from 'meteor/meteor';

import changelog from '/imports/api/changelog';
import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

class AppClass extends React.Component<*, *> {
  componentWillMount() {
    store.setBrowserHistory(this.props.history);
    this.updateGraphId(this.props.match && this.props.match.params.graphId);
  }

  componentWillReceiveProps = (nextProps: Object) => {
    if (
      nextProps.match &&
      nextProps.match.params.graphId &&
      nextProps.match.params.graphId !== this.props.match.params.graphId
    ) {
      this.updateGraphId(nextProps.match.params.graphId);
    }
  };

  updateGraphId = (graphIdWanted: string) => {
    const graphId = assignGraph(graphIdWanted);
    store.setId(graphId);
  };

  componentDidMount() {
    bindKeys();

    const user = Meteor.user();
    if (!user?.profile.lastVersionChangelog) {
      Meteor.users.update(Meteor.userId(), {
        $set: { 'profile.lastVersionChangelog': changelog.length - 1 }
      });
    }
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  render() {
    return (
      <Provider store={store}>
        <div id="graph" style={{ height: '100%', overflow: 'hidden' }}>
          <EditorContainer />
        </div>
      </Provider>
    );
  }
}

const GraphEditor = withRouter(AppClass);
GraphEditor.displayName = 'GraphEditor';

export default GraphEditor;

const bindKeys = () => {
  Mousetrap.bind('esc', () => {
    if (!store.ui.sidepanelOpen) {
      store.ui.cancelAll();
      store.ui.unselect();
    }
  });
  Mousetrap.bind('backspace', () => store.deleteSelected(false));
  Mousetrap.bind('shift+backspace', () => store.deleteSelected(true));
  Mousetrap.bind('?', () => store.ui.setShowHelpModal(true));
  Mousetrap.bind('!', () => store.ui.setShowChangelogModal(true));
  Mousetrap.bind('s', () => store.operatorStore.place('social'));
  Mousetrap.bind('+', () => store.activityStore.duplicateActivity());
  Mousetrap.bind('c', () => store.operatorStore.place('control'));
  Mousetrap.bind('p', () => store.operatorStore.place('product'));
  Mousetrap.bind('z', store.activityStore.organize);
  Mousetrap.bind('r', store.activityStore.resize);
  Mousetrap.bind('w', e => {
    store.ui.toggleSidepanelOpen();
    e.preventDefault();
  });
  Mousetrap.bind('a', () => store.activityStore.newActivityAbove());
  Mousetrap.bind('1', () => store.activityStore.newActivityAbove(1));
  Mousetrap.bind('2', () => store.activityStore.newActivityAbove(2));
  Mousetrap.bind('3', () => store.activityStore.newActivityAbove(3));
  Mousetrap.bind('shift+up', () => store.activityStore.movePlane(1));
  Mousetrap.bind('shift+down', () => store.activityStore.movePlane(-1));
};
