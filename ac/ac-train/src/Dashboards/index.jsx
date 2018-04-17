// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import {
  type LogT,
  type dashboardViewerPropsT,
  ProgressDashboard
} from 'frog-utils';

import { times, constant } from 'lodash';

import MeanError from './MeanError';
import MeanTime from './MeanTime';

import MeanErrorPerInterface from './MeanErrorPerInterface';
import MeanTimePerInterface from './MeanTimePerInterface';
import MeanHelpPerInterface from './MeanHelpPerInterface';

import MeanTimePerTryForEachInterface from './MeanTimePerTryForEachInterface';
import MeanErrPerTryForEachInterface from './MeanErrPerTryForEachInterface';

const Viewer = (props: dashboardViewerPropsT) => {
  return (
    <React.Fragment>
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <MeanError {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanTime {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanTimePerTryForEachInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanErrPerTryForEachInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanTimePerInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanErrorPerInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanHelpPerInterface {...props} />
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
      dataFn.objInsert({ [activity]: times(5, constant(0)), ...data['time'] }, [
        'time'
      ]);
    }

    if (!isCorrect) {
      dataFn.numIncr(1, ['error', activity, iteration]);
      dataFn.numIncr(1, ['sum', 'error', instance]);
    }

    dataFn.numIncr(1, ['count', activity, iteration]);
    dataFn.numIncr(1, ['sum', 'count', instance]);

    dataFn.numIncr(timeTaken / 1000, ['time', activity, iteration]);
    dataFn.numIncr(timeTaken / 1000, ['sum', 'time', instance]);

    console.log('DATA', data);
  }

  if (log.type === 'help' && log.payload) {
    const { activity } = log.payload;

    if (!data['help'][activity]) {
      dataFn.objInsert({ [activity]: 0 }, ['help']);
    }

    dataFn.numIncr(1, ['help', activity]);
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  stats: statsDashboard
};
