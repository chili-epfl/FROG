// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';

import Graph from '../GraphEditor/Graph';
import { connect, store } from '../GraphEditor/store';

const ReadOnlyGraph = connect(({
  store: { ui: { graphWidth, panOffset } }
}) => (
  <Graph
    width={graphWidth}
    height={400}
    viewBox={[panOffset, 0, graphWidth, 600].join(' ')}
    scaled
    hasTimescale
  />
));

class GraphView extends Component {
  componentWillMount() {
    store.setId(this.props.session.copyGraphId, true);
  }

  render() {
    return (
      <Provider store={store}>
        <GraphViewContainer>
          <ReadOnlyGraph />
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
