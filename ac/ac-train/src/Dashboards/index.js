// @flow

import * as React from 'react';
import { times, constant } from 'lodash';
import Measure from 'react-measure';

import {
  type LogDbT,
  type ActivityDbT,
  type DashboardViewerPropsT,
  type DashboardT,
  ProgressDashboard,
  LeaderBoard
} from 'frog-utils';

import MeanPerInterface from './MeanPerInterface';
import MeanPerTryForEachInterface from './MeanPerTryForEachInterface';

const styles = {
  flexGrid: {
    display: 'flex',
    padding: '40px',
    background: '#f5f8fa',
    flexWrap: 'wrap'
  },
  lg: {
    width: '25%',
    padding: '10px'
  },
  md: {
    width: '33%',
    padding: '10px'
  },
  sm: {
    width: '50%',
    padding: '10px'
  },
  xs: {
    width: '100%'
  }
};

const getComponentStyles = width => {
  if (width > 600 && width <= 960) {
    return 'sm';
  } else if (width > 960 && width <= 1280) {
    return 'md';
  } else if (width > 1280) {
    return 'lg';
  }

  return 'xs';
};

type StateT = {
  width: number
};

class AllDashboards extends React.Component<DashboardViewerPropsT, StateT> {
  state = {
    width: -1
  };

  render() {
    const { width } = this.state;

    const widthStyle = getComponentStyles(width);

    return (
      <Measure
        bounds
        onResize={contentRect => {
          this.setState({ width: contentRect.bounds.width });
        }}
      >
        {({ measureRef }) => (
          <div ref={measureRef} style={styles.flexGrid}>
            <div style={styles[widthStyle]}>
              <MeanPerTryForEachInterface {...this.props} whichDash="error" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerTryForEachInterface {...this.props} whichDash="time" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="time" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="error" />
            </div>
            <div style={styles[widthStyle]}>
              <MeanPerInterface {...this.props} whichDash="help" />
            </div>
          </div>
        )}
      </Measure>
    );
  }
}

const Viewer = (props: DashboardViewerPropsT) => <AllDashboards {...props} />;

export type DashStateT = {
  error: { [t: string]: number[] },
  time: { [t: string]: number[] },
  help: { [t: string]: number },
  count: { [t: string]: number[] },
  sum: { [t: string]: number[] }
};

const initData: DashStateT = {
  error: {},
  time: {},
  help: {},
  count: {},
  sum: {}
};

const mergeLog = (state: DashStateT, log: LogDbT, activity: ActivityDbT) => {
  if (log.type === 'answer' && log.payload) {
    const { iterationPerInterface } = activity.data;

    const { whichInterface, iteration, isCorrect, timeTaken } = log.payload;

    const iterationOnInterface = iteration % iterationPerInterface;

    // Ensure initialization of state
    ['error', 'count', 'time'].forEach(type => {
      if (!state[type][whichInterface]) {
        state[type][whichInterface] = times(iterationPerInterface, constant(0));
      }
      if (!state['sum'][type]) {
        state['sum'][type] = times(4 * iterationPerInterface, constant(0));
      }
    });

    // Increment desired values
    if (!isCorrect) {
      state['error'][whichInterface][iterationOnInterface] += 1;
      state['sum']['error'][iteration] += 1;
    }

    state['count'][whichInterface][iterationOnInterface] += 1;
    state['sum']['count'][iteration] += 1;

    state['time'][whichInterface][iterationOnInterface] += timeTaken / 1000;
    state['sum']['time'][iteration] += timeTaken / 1000;
  }

  if (log.type === 'help' && log.payload) {
    const { whichInterface } = log.payload;
    if (!state['help'][whichInterface]) {
      state['help'][whichInterface] = 0;
    }
    state['help'][whichInterface] += 1;
  }
};

const exampleLogs = [
  {
    type: 'logs',
    title: 'CS211',
    path: '/clientFiles/ac-train/exampleLogs/cs211.json'
  }
];

const statsDashboard: DashboardT = { Viewer, mergeLog, initData, exampleLogs };

export default {
  stats: statsDashboard,
  progress: ProgressDashboard,
  leaderboard: LeaderBoard
};
