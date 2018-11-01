// @flow

import * as React from 'react';
import { Provider } from 'mobx-react';
import { isEqual } from 'lodash';
import { withStyles } from '@material-ui/core/styles';

import ShowInfo from './ShowInfo';
import Graph from '../GraphEditor/Graph';
import { store as globalStore, connect } from '../GraphEditor/store';

type GraphViewPropsT = {
  session: Object,
  classes: Object,
  store: Object
};

const styles = {
  graphInSession: {
    height: '400px',
    border: '1px solid black'
  }
};

class GraphViewController extends React.Component<GraphViewPropsT, {}> {
  initStore = (session: any) => {
    this.props.store.setBrowserHistory(null);
    this.props.store.setId(session.graphId, true);
    this.props.store.setSession(session);
    this.props.store.session.setTimes(session);
  };

  componentWillMount() {
    this.initStore(this.props.session);
  }

  componentWillReceiveProps(nextProps: { session: Object }) {
    if (!isEqual(nextProps.session, this.props.session)) {
      this.initStore(nextProps.session);
      if (this.props.store.session) {
        this.props.store.session.setTimes(nextProps.session);
      }
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.props.store.ui.updateWindow);
    this.props.store.ui.updateWindow();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.props.store.ui.updateWindow);
    this.props.store.session.close();
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.graphInSession}>
        <ShowInfo />
        <Graph scaled hasTimescale isSession />
      </div>
    );
  }
}

const GraphView = connect(GraphViewController);

const StyledConnectedEditor = withStyles(styles)(props => (
  <Provider store={globalStore}>
    <GraphView {...props} />
  </Provider>
));

export default StyledConnectedEditor;
