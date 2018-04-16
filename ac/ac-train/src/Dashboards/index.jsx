// @flow

import * as React from 'react';
import Grid from 'material-ui/Grid';
import {
  type LogT,
  type dashboardViewerPropsT,
  ProgressDashboard
} from 'frog-utils';

import { times, constant } from 'lodash';

import MeanErrPerTryForEachInterface from './MeanErrPerTryForEachInterface';
import MeanErrorPerInterface from './MeanErrorPerInterface';

const Viewer = (props: dashboardViewerPropsT) => {
  return (
    <React.Fragment>
      <Grid container spacing={24}>
        <Grid item xs={6}>
          <MeanErrPerTryForEachInterface {...props} />
        </Grid>
        <Grid item xs={6}>
          <MeanErrorPerInterface {...props} />
        </Grid>

        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <Grid key={i} item xs={6}>
            <h1>H</h1>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
};

const initData = {
  error: {},
  time: {}
};

const mergeLog = (data: any, dataFn: Object, log: LogT) => {
  if (log.type === 'answer' && log.payload) {
    const { activity, iteration, checkAnswer, timeTaken } = log.payload;

    console.log(timeTaken);

    if (!data['error'][activity]) {
      const payload = {
        ...data['error'],
        [activity]: {
          wrong: times(5, constant(0)),
          count: times(5, constant(0)),
          time: times(5, constant(0))
        }
      };

      dataFn.objInsert(payload, ['error']);
    }

    if (!checkAnswer) {
      dataFn.numIncr(1, ['error', activity, 'wrong', iteration]);
    }
    dataFn.numIncr(1, ['error', activity, 'count', iteration]);
    dataFn.numIncr(timeTaken, ['error', activity, 'time', iteration]);
  }
};

const statsDashboard = { Viewer, mergeLog, initData };

export default {
  stats: statsDashboard
};
