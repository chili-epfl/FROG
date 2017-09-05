import React, { Component } from 'react';
// @flow
import { Provider } from 'mobx-react';
import Mousetrap from 'mousetrap';
import { withRouter } from 'react-router';

import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

class AppClass extends Component {
  componentWillMount() {
    store.setBrowserHistory(this.props.history);
    bindKeys();
    this.updateGraphId(this.props.match && this.props.match.params.graphId);
  }

  componentWillReceiveProps = (nextProps: Object) => {
    if (
      nextProps.match &&
      nextProps.match.params.graphId !== this.props.match.params.graphId
    ) {
      this.updateGraphId(nextProps.match.params.graphId);
    }
  };

  updateGraphId = (graphIdWanted: string) => {
    const graphId = assignGraph(graphIdWanted);
    store.setId(graphId);
  };

  componentWillUnmount() {
    Mousetrap.reset();
  }

  render() {
    return (
      <Provider store={store}>
        <div id="graph">
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
  Mousetrap.bind('backspace', store.deleteSelected);
  Mousetrap.bind('?', () => store.ui.setModal(true));
  Mousetrap.bind('s', () => store.operatorStore.place('social'));
  Mousetrap.bind('c', () => store.operatorStore.place('control'));
  Mousetrap.bind('p', () => store.operatorStore.place('product'));
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
