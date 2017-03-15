// @flow
import React, { Component } from 'react';
import { Provider } from 'mobx-react';

import { store } from './store';
import { assignGraph } from '../../api/graphs';
import EditorContainer from './EditorContainer';

export default class AppClass extends Component {
  componentWillMount() {
    store.setId(assignGraph());
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
