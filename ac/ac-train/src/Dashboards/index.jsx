// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import {
  type LogDbT,
  type ActivityDbT,
  type DashboardViewerPropsT,
  type DashboardT,
  ProgressDashboard
} from 'frog-utils';

import { times, constant } from 'lodash';

import MeanThroughOutStudy from './MeanThroughOutStudy';
import MeanPerInterface from './MeanPerInterface';
import MeanPerTryForEachInterface from './MeanPerTryForEachInterface';

const Viewer = (props: DashboardViewerPropsT) => (
  <React.Fragment>
    <Grid
      container
      spacing={24}
      style={{ padding: '40px', background: '#f5f8fa' }}
    >
      <Grid item lg={4} md={6} sm={12}>
        <MeanThroughOutStudy {...props} whichDash="error" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanThroughOutStudy {...props} whichDash="time" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanPerTryForEachInterface {...props} whichDash="error" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanPerTryForEachInterface {...props} whichDash="time" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanPerInterface {...props} whichDash="time" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanPerInterface {...props} whichDash="error" />
      </Grid>
      <Grid item lg={4} md={6} sm={12}>
        <MeanPerInterface {...props} whichDash="help" />
      </Grid>
    </Grid>
  </React.Fragment>
);

const initData = {
  error: {},
  time: {},
  help: {},
  count: {},
  sum: {}
};

const mergeLog = (state: Object, log: LogDbT, activity: ActivityDbT) => {
  if (log.type === 'answer' && log.payload) {
    const { iterationPerInterface } = activity.data;

    const { whichInterface, iteration, isCorrect, timeTaken } = log.payload;

    const iterationOnInterface = iteration % iterationPerInterface;

    ['error', 'count', 'time'].forEach(type => {
      if (!state[type][whichInterface]) {
        state[type][whichInterface] = times(iterationPerInterface, constant(0));
      }

      if (!state['sum'][type]) {
        state['sum'][type] = times(4 * iterationPerInterface, constant(0));
      }
    });

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

const statsDashboard: DashboardT = { Viewer, mergeLog, initData };

export default {
  stats: statsDashboard,
  progress: ProgressDashboard
};
