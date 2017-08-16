// @flow
import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import Mousetrap from 'mousetrap';
import { withRouter } from 'react-router';

import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

class AppClass extends Component {
  componentWillMount() {
    const graphId = assignGraph(this.props.graphId);
    store.setBrowserHistory(this.props.history);
    store.setId(graphId);
    bindKeys();
  }

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

export default withRouter(AppClass);

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
  Mousetrap.bind('p', () => store.operatorStore.place('product'));
  Mousetrap.bind('w', e => {
    store.ui.toggleSidepanelOpen();
    e.preventDefault();
  });
  Mousetrap.bind('a', () => store.activityStore.newActivityAbove());
  Mousetrap.bind('1', () => store.activityStore.newActivityAbove(1));
  Mousetrap.bind('2', () => store.activityStore.newActivityAbove(2));
  Mousetrap.bind('3', () => store.activityStore.newActivityAbove(3));
};
