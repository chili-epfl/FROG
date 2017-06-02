// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';

import Graph from '../GraphEditor/Graph';
import { store } from '../GraphEditor/store';

class GraphView extends Component {
  componentDidMount() {
    store.setId(this.props.session.copyGraphId, true);
  }

  componentWillReceiveProps(nextProps: { session: { copyGraphId: String } }) {
    store.setId(nextProps.session.copyGraphId, true);
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
