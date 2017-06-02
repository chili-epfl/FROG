// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';

import Graph from '../GraphEditor/Graph';
import { store } from '../GraphEditor/store';

class GraphView extends Component {
  componentWillMount() {
    store.setId(this.props.session.graphId, true);
  }

  componentWillReceiveProps(nextProps: { session: { graphId: String } }) {
    store.setId(nextProps.session.graphId, true);
  }

  render() {
    return (
      <Provider store={store}>
        <GraphViewContainer>
          <Graph scaled hasTimescale />
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
