// @flow
import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

export default class AppClass extends Component {
  componentWillMount() {
    store.setId(assignGraph());
    window.addEventListener('keydown', keyDown);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', keyDown);
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

const keyDown = e => {
  if (store.mode === 'rename') {
    return;
  }
  if (
    !store.ui.overGraph ||
    store.state.mode === 'rename' ||
    e.ctrlKey ||
    e.altKey ||
    e.metaKey
  ) {
    return;
  }

  if (e.keyCode === 27) {
    // esc - cancel selection
    e.preventDefault();
    store.ui.cancelAll();
    store.ui.unselect();
  }
  if (e.keyCode === 8) {
    // backspace - delete
    e.preventDefault();
    store.deleteSelected();
  }
  if (e.keyCode === 191 && e.shiftKey) {
    // ? - help
    e.preventDefault();
    store.ui.setModal(true);
  }
  if (e.keyCode === 83) {
    // s - social operator
    e.preventDefault();
    store.operatorStore.place('social');
  }
  if (e.keyCode === 80) {
    // p - product operator
    e.preventDefault();
    store.operatorStore.place('product');
  }
};
