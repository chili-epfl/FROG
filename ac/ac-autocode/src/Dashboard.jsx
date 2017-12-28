// @flow

import React from 'react';

import { type LogDBT } from 'frog-utils';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTheme,
  VictoryStack
} from 'victory';

const Viewer = (props: Object) => {
  //props = {users, instances, data, config}

  const chartData = value => {
    return props.config.tests.map((test, index) => {
      return {
        x: 'test ' + index,
        y: props.data.tests[index] ? props.data.tests[index][value] : 0
      };
    });
  };
  return (
    <div style={{ height: '2000px', overflow: 'scroll' }}>
      <h1>Dashboard for activity: {props.config.title}</h1>
      <p>
        {Object.keys(props.users).length} students have registered to this
        activity
      </p>
      <p>
        {Object.keys(props.data.students).length} students have started coding
      </p>
      <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        <VictoryStack>
          <VictoryBar data={chartData('success')} />
          <VictoryBar data={chartData('danger')} />
          <VictoryBar data={chartData('error')} />
        </VictoryStack>
      </VictoryChart>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  let previousStatus = '';
  if (data.students[log.userId]) {
    dataFn.objInsert(log.payload, ['students', log.userId, 'code']);
    if (data.students[log.userId][log.itemId]) {
      previousStatus = data.students[log.userId][log.itemId].status;
      dataFn.numIncr(1, ['students', log.userId, log.itemId, log.value]);
      dataFn.objInsert(log.value, [
        'students',
        log.userId,
        log.itemId,
        'status'
      ]);
    } else {
      dataFn.objInsert(
        {
          status: log.value,
          success: log.value === 'success' ? 1 : 0,
          danger: log.value === 'danger' ? 1 : 0,
          error: log.value === 'error' ? 1 : 0
        },
        ['students', log.userId, log.itemId]
      );
    }
  } else {
    log.itemId !== undefined &&
      dataFn.objInsert(
        {
          code: log.payload,
          [log.itemId]: {
            status: log.value,
            success: log.value === 'success' ? 1 : 0,
            danger: log.value === 'danger' ? 1 : 0,
            error: log.value === 'error' ? 1 : 0
          }
        },
        ['students', log.userId]
      );
  }

  if (log.type === 'test') {
    if (data.tests[log.itemId]) {
      dataFn.numIncr(1, ['tests', log.itemId, log.value]);
      previousStatus &&
        dataFn.numIncr(-1, ['tests', log.itemId, previousStatus]);
    } else {
      dataFn.objInsert(
        {
          success: log.value === 'success' ? 1 : 0,
          danger: log.value === 'danger' ? 1 : 0,
          error: log.value === 'error' ? 1 : 0
        },
        ['tests', log.itemId]
      );
    }
  }
};

const initData = { logs: [], tests: {}, students: {} };

export default {
  Viewer,
  mergeLog,
  initData
};
