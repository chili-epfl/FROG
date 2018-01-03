// @flow

import React from 'react';

import { type LogDBT } from 'frog-utils';
import {
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryStack,
  VictoryLegend,
  VictoryLabel
} from 'victory';

const Viewer = (props: Object) => {
  // props = {users, instances, data, config}

  const chartData = value =>
    props.config.tests.map((test, index) => ({
      x: 'test ' + index,
      y: props.data.tests[index] ? props.data.tests[index][value] : 0
    }));

  const sum = x => x['success'] + x['danger'] + x['error'] || 0;

  const debugData = () => {
    const o = Object.keys(props.data.students).reduce(
      (acc, val) => {
        if (acc) {
          if (props.data.students[val][-1] !== undefined) {
            const num = sum(props.data.students[val][-1]);
            if (acc[num] !== undefined) {
              acc[num] += 1;
            } else {
              acc[num] = 1;
            }
          } else {
            acc[0] += 1;
          }
        }
        return acc;
      },
      { '0': 0 }
    );
    // ex o = {0:10, 1:5, 2:17} (10 students did not use the debug, 17 used it twice )
    return Object.keys(o).reduce((acc, val) => {
      acc.push({ x: val, y: o[val] });
      return acc;
    }, []);
  };

  const green = '#33cc33';
  const red1 = '#ff0000';
  const red2 = '#cc0000';

  return (
    <div style={{ height: '1000px', overflow: 'scroll' }}>
      <h1>Dashboard for activity: {props.config.title}</h1>
      <p>
        {Object.keys(props.users).length} students have registered to this
        activity
      </p>
      <p>
        {Object.keys(props.data.students).length} students have started coding
      </p>
      <VictoryChart
        domain={{
          x: [0, props.config.tests.length],
          y: [0, Object.keys(props.data.students).length + 1]
        }}
        domainPadding={20}
      >
        <VictoryLegend
          x={125}
          y={0}
          orientation="horizontal"
          title="Students' current results"
          centerTitle
          gutter={20}
          style={{ border: { stroke: 'black' } }}
          data={[
            { name: 'Sucess', symbol: { fill: green } },
            { name: 'Danger', symbol: { fill: red1 } },
            { name: 'Error', symbol: { fill: red2 } }
          ]}
        />
        <VictoryAxis
          tickFormat={props.config.tests.map(
            (val, index) => 'Test ' + (index + 1)
          )}
        />
        <VictoryAxis dependentAxis />
        <VictoryStack>
          <VictoryBar
            data={chartData('success')}
            style={{ data: { fill: green } }}
          />
          <VictoryBar
            data={chartData('danger')}
            style={{ data: { fill: red1 } }}
          />
          <VictoryBar
            data={chartData('error')}
            style={{ data: { fill: red2 } }}
          />
        </VictoryStack>
      </VictoryChart>
      <VictoryChart
        domain={{
          y: [0, Object.keys(props.data.students).length + 1]
        }}
        domainPadding={20}
      >
        <VictoryLabel x={125} text="Use of debug" />
        <VictoryAxis />
        <VictoryAxis dependentAxis />
        <VictoryBar data={debugData()} />
      </VictoryChart>
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  let previousStatus = '';
  let codeUpdated = true;
  if (data.students[log.userId]) {
    // student already seen
    if (data.students[log.userId].code !== log.payload) {
      // update code if changed
      dataFn.objInsert(log.payload, ['students', log.userId, 'code']);
    } else {
      codeUpdated = false;
    }
    if (data.students[log.userId][log.itemId]) {
      // student already submitted for this test (or debug) once
      previousStatus = data.students[log.userId][log.itemId].status;
      if (previousStatus !== log.value || codeUpdated) {
        dataFn.numIncr(1, ['students', log.userId, log.itemId, log.value]);
        dataFn.objInsert(log.value, [
          'students',
          log.userId,
          log.itemId,
          'status'
        ]);
      }
    } else {
      // first time for that test
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
  } else if (log.itemId !== undefined) {
    // first time that student is seen

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
      if (previousStatus) {
        dataFn.numIncr(-1, ['tests', log.itemId, previousStatus]);
      }
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
