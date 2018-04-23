// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import {
  type LogT,
  type DashboardViewerPropsT,
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
  sum: {
    error: times(20, constant(0)),
    count: times(20, constant(0)),
    time: times(20, constant(0))
  }
};

const mergeLog = (state: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { activity, instance, isCorrect, timeTaken } = log.payload;

    // activity = interfaceType, instance = iteration,

    const iteration = instance % 5;

    if (!state['error'][activity]) {
      state['error'][activity] = times(5, constant(0));
    }

    if (!state['count'][activity]) {
      state['count'][activity] = times(5, constant(0));
    }

    if (!state['time'][activity]) {
      state['time'][activity] = times(5, constant(0));
    }

    if (!isCorrect) {
      state['error'][activity][iteration] += 1;
      state['sum']['error'][instance] += 1;
    }

    state['count'][activity][iteration] += 1;
    state['sum']['count'][instance] += 1;

    state['time'][activity][iteration] += timeTaken / 1000;
    state['sum']['time'][instance] += timeTaken / 1000;
  }

  if (log.type === 'help' && log.payload) {
    const { activity } = log.payload;
    if (!state['help'][activity]) {
      state['help'][activity] = 0;
    }
    state['help'][activity] += 1;
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  stats: statsDashboard,
  progress: ProgressDashboard
};
