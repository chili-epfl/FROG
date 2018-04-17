// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import {
  type LogT,
  type dashboardViewerPropsT,
  ProgressDashboard
} from 'frog-utils';

import { times, constant } from 'lodash';

import MeanThroughOutStudy from './MeanThroughOutStudy';
import MeanPerInterface from './MeanPerInterface';

import MeanHelpPerInterface from './MeanHelpPerInterface';

import MeanTimePerTryForEachInterface from './MeanTimePerTryForEachInterface';
import MeanErrPerTryForEachInterface from './MeanErrPerTryForEachInterface';

const Viewer = (props: dashboardViewerPropsT) => {
  return (
    <React.Fragment>
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <MeanThroughOutStudy {...props} whichDash="error" />
        </Grid>
        <Grid item xs={6}>
          <MeanThroughOutStudy {...props} whichDash="time" />
        </Grid>
        <Grid item xs={6}>
          <MeanTimePerTryForEachInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanErrPerTryForEachInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanPerInterface {...props} whichDash="time" />
        </Grid>
        <Grid item xs={6}>
          <MeanPerInterface {...props} whichDash="error" />
        </Grid>
        <Grid item xs={6}>
          <MeanPerInterface {...props} whichDash="help" />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

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

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { activity, instance, isCorrect, timeTaken } = log.payload;

    // activity = interfaceType, instance = iteration,

    const iteration = instance % 5;

    if (!data['error'][activity]) {
      dataFn.objInsert(
        { [activity]: times(5, constant(0)), ...data['error'] },
        ['error']
      );
    }

    if (!data['count'][activity]) {
      dataFn.objInsert(
        { [activity]: times(5, constant(0)), ...data['count'] },
        ['count']
      );
    }

    if (!data['time'][activity]) {
      dataFn.objInsert(times(5, constant(0)), ['time', activity]);
    }

    if (!isCorrect) {
      dataFn.numIncr(1, ['error', activity, iteration]);
      dataFn.numIncr(1, ['sum', 'error', instance]);
    }

    dataFn.numIncr(1, ['count', activity, iteration]);
    dataFn.numIncr(1, ['sum', 'count', instance]);

    dataFn.numIncr(timeTaken / 1000, ['time', activity, iteration]);
    dataFn.numIncr(timeTaken / 1000, ['sum', 'time', instance]);
  }

  if (log.type === 'help' && log.payload) {
    const { activity } = log.payload;

    if (!data['help'][activity]) {
      dataFn.objInsert(0, ['help', activity]);
    }

    dataFn.numIncr(1, ['help', activity]);
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  stats: statsDashboard
};
