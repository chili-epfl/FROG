// @flow

import * as React from 'react';
import styled from 'styled-components';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';

import ShowInfo from './ShowInfo';
import Graph from '../GraphEditor/Graph';
import { store } from '../GraphEditor/store';

type GraphViewPropsT = {
  session: Object,
  history: Object
};

class GraphView extends React.Component<GraphViewPropsT,{}> {
  initStore = (session: any) => {
    store.setBrowserHistory(this.props.history, '/teacher');
    store.setId(session.graphId, true);
    store.setSession(session);
    store.session.setTimes(session);
  };

  componentWillMount() {
    this.initStore(this.props.session);
  }

  componentWillReceiveProps(nextProps: { session: Object }) {
    if (!isEqual(nextProps.session, this.props.session)) {
      this.initStore(nextProps.session);
      if (store.session) {
        store.session.setTimes(nextProps.session);
      }
    }
  }

  componentWillUnmount() {
    store.session.close();
  }

  render() {
    const styles = {
      sheet: {
        padding: 0,
        maxHeight: '100%',
        overflow: 'auto'
      }
    };

    return (
      <Provider store={store}>
        <div style={styles.sheet}>
          <GraphViewContainer>
            <ShowInfo />
            <Graph scaled hasTimescale isSession />
          </GraphViewContainer>
        </div>
      </Provider>
    );
  }
}

const GraphViewContainer = styled.div`
  height: 400px;
  width: 99%;
  text-align: center;
  border: 1px solid black;
`;

GraphView.displayName = 'GraphView';
export default withRouter(GraphView);
