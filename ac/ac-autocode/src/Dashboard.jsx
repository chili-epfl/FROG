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
  const testsData = value =>
    props.config.tests &&
    props.config.tests.map((test, index) => ({
      x: 'test ' + index,
      y: props.data.tests[index] ? props.data.tests[index][value] : 0
    }));

  const runData = () => {
    // props.instances is an array ex: ["hmASM6jiz7vRoEvoh","LhqDCQgqh3N733SXE"]
    const o = props.instances.reduce((acc, instanceId) => {
      const userData = props.data.students[instanceId];
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

  const displayTestChart = props.config.tests && props.config.tests.length > 0;

  return (
    <div
      style={{
        height: displayTestChart ? '1100px' : '550px',
        overflow: 'scroll'
      }}
    >
      <h1>Dashboard for activity: {props.config.title}</h1>
      <p>
        {Object.keys(props.users).length} students have registered to this
        activity
      </p>
      <p>
        There are {Object.keys(props.instances).length} instance(s) of students
        and {Object.keys(props.data.students).length} of them have started
        running tests
      </p>
      {displayTestChart && (
        <div>
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

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  let previousStatus = '';
  if (data.students[log.instanceId]) {
    // student already seen
    if (data.students[log.instanceId][log.itemId]) {
      // student already submitted for this test (or debug) once
      previousStatus = data.students[log.instanceId][log.itemId];
    }
    dataFn.objInsert(log.value, ['students', log.instanceId, log.itemId]);
  } else if (log.itemId !== undefined) {
    // first time that student is seen
    dataFn.objInsert({ [log.itemId]: log.value, debugCount: 0 }, [
      'students',
      log.instanceId
    ]);
  }

  if (log.itemId === -1) {
    dataFn.numIncr(1, ['students', log.instanceId, 'debugCount']);
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
