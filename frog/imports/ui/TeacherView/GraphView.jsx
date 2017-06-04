// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';

import Graph from '../GraphEditor/Graph';
import { store } from '../GraphEditor/store';

class GraphView extends Component {
  initStore = session => {
    store.setId(session.graphId, true);
    store.setSession(session);
  };

  componentWillMount() {
    this.initStore(this.props.session);
  }

  componentWillReceiveProps(nextProps: { session: Object }) {
    console.log('update');
    this.initStore(nextProps.session);
    if (store.session) {
      store.session.setTimes(nextProps.session);
    }
  }

  render() {
    return (
      <Provider store={store}>
        <GraphViewContainer>
          <Graph scaled hasTimescale isSession />
        </GraphViewContainer>
      </Provider>
    );
  }
}

const GraphViewContainer = styled.div`
  height: 400px;
  width: 700px;
`;

export default GraphView;
