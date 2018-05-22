// @flow

import * as React from 'react';
import { Provider } from 'mobx-react';
import { withRouter } from 'react-router';
import { isEqual } from 'lodash';

import { withStyles } from '@material-ui/core/styles';

import ShowInfo from './ShowInfo';
import Graph from '../GraphEditor/Graph';
import { store } from '../GraphEditor/store';

type GraphViewPropsT = {
  session: Object,
  history: Object,
  classes: Object
};

const styles = {
  graphInSession: {
    height: '400px',
    border: '1px solid black'
  }
};

class GraphViewController extends React.Component<GraphViewPropsT, {}> {
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

  componentDidMount() {
    window.addEventListener('resize', store.ui.updateWindow);
    store.ui.updateWindow();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', store.ui.updateWindow);
    store.session.close();
  }

  render() {
    const { classes } = this.props;
    return (
      <Provider store={store}>
        <div className={classes.graphInSession}>
          <ShowInfo />
          <Graph scaled hasTimescale isSession />
        </div>
      </Provider>
    );
  }
}

const GraphView = withRouter(GraphViewController);

export default withStyles(styles)(GraphView);
