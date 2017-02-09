// @flow
import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import { store } from './store';
import EditorContainer from './EditorContainer';

export default class AppClass extends Component {
  componentWillMount() {
    // store.ui.setId(assignGraph());
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
  }
  // if (e.keyCode === 27) {
  //   // esc
  //   store.ui.cancelAll();
  //   store.ui.unselect();
  // }
  // if (e.keyCode === 8) {
  //   // backspace
  //   store.deleteSelected();
  // }
  // if (e.keyCode === 83) {
  //   // s - social operator
  //   store.placeOperator('social');
  // }
  // if (e.keyCode === 80) {
  //   // p - product operator
  //   store.placeOperator('product');
  // }
};
