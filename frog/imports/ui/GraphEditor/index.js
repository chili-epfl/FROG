// @flow
import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import Mousetrap from 'mousetrap';

import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

export default class AppClass extends Component {
  componentWillMount() {
    store.setId(assignGraph());
    bindKeys();
  }

  componentWillUnmount() {
    Mousetrap.reset();
  }

  render() {
    return (
      <Provider store={store}>
        <div>
          <EditorContainer />
        </div>
      </Provider>
    );
  }
}

const bindKeys = () => {
  Mousetrap.bind('esc', () => {
    store.ui.cancelAll();
    store.ui.unselect();
  });
  Mousetrap.bind('backspace', store.deleteSelected);
  Mousetrap.bind('?', () => store.ui.setModal(true));
  Mousetrap.bind('s', () => store.operatorStore.place('social'));
  Mousetrap.bind('p', () => store.operatorStore.place('product'));
  Mousetrap.bind('w', () => store.ui.toggleSidepanelOpen());
};
