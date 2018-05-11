// @flow

import React from 'react';

import { type LogDbT } from 'frog-utils';
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
  const config = props.activity.data;
  const testsData = value =>
    config.tests &&
    config.tests.map((test, index) => ({
      x: 'test ' + index,
      y: props.state.tests[index] ? props.state.tests[index][value] : 0
    }));

  const runData = () => {
    // props.instances is an array ex: ["hmASM6jiz7vRoEvoh","LhqDCQgqh3N733SXE"]
    const o = props.instances.reduce((acc, instanceId) => {
      const userData = props.state.students[instanceId];
      const count = userData ? userData.debugCount : 0;
      acc[count] = 1 + (acc[count] ? acc[count] : 0);
      return acc;
    }, {});
    // ex o = {0:10, 1:5, 2:17} (10 students did not use the run button, 17 used it twice)
    return Object.keys(o).map(key => ({ x: key, y: o[key] }));
  };

  const green = '#33cc33';
  const red1 = '#ff0000';
  const red2 = '#660000';

  const displayTestChart = config.tests && config.tests.length > 0;

  return (
    <div
      style={{
        height: displayTestChart ? '1100px' : '550px',
        overflow: 'scroll'
      }}
    >
      <h1>Dashboard for activity: {config.title}</h1>
      <p>
        {Object.keys(props.users).length} students have registered to this
        activity
      </p>
      <p>
        There are {Object.keys(props.instances).length} instance(s) of students
        and {Object.keys(props.state.students).length} of them have started
        running tests
      </p>
      {displayTestChart && (
        <div>
          <VictoryChart
            domain={{
              x: [0, config.tests.length],
              y: [0, Object.keys(props.state.students).length + 1]
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
              tickFormat={config.tests.map(
                (val, index) => 'Test ' + (index + 1)
              )}
            />
            <VictoryAxis dependentAxis />
            <VictoryStack>
              <VictoryBar
                data={testsData('success')}
                style={{ data: { fill: green } }}
              />
              <VictoryBar
                data={testsData('danger')}
                style={{ data: { fill: red1 } }}
              />
              <VictoryBar
                data={testsData('error')}
                style={{ data: { fill: red2 } }}
              />
            </VictoryStack>
          </VictoryChart>
        </div>
      )}
      <div>
        <VictoryChart domainPadding={20}>
          <VictoryLabel x={125} y={20} text="Run of own code" />
          <VictoryAxis label="Number of times" />
          <VictoryAxis dependentAxis />
          <VictoryBar data={runData()} />
        </VictoryChart>
      </div>
    </div>
  );
};

const mergeLog = (state: any, log: LogDbT) => {
  let previousStatus = '';
  if (state.students[log.instanceId]) {
    // student already seen
    if (state.students[log.instanceId][log.itemId]) {
      // student already submitted for this test (or debug) once
      previousStatus = state.students[log.instanceId][log.itemId];
    }
    state.students[log.instanceId][log.itemId] = log.value;
  } else if (log.itemId !== undefined) {
    // first time that student is seen
    state.students[log.instanceId] = { [log.itemId]: log.value, debugCount: 0 };
  }

  if (log.itemId === -1) {
    state.students[log.instanceId].debugCount += 1;
  }

  if (log.type === 'test') {
    if (state.tests[log.itemId]) {
      state.tests[log.itemId][log.value] += 1;
      if (previousStatus) {
        state.tests[log.itemId][previousStatus] -= 1;
      }
    } else {
      state.tests[log.itemId] = {
        success: log.value === 'success' ? 1 : 0,
        danger: log.value === 'danger' ? 1 : 0,
        error: log.value === 'error' ? 1 : 0
      };
    }
  }
};

const initData = { logs: [], tests: {}, students: {} };

export default {
  dashboard: {
    Viewer,
    mergeLog,
    initData
  }
};
