import * as React from 'react';

import {
  VictoryBar,
  VictoryGroup,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryTheme,
  VictoryLine
} from 'victory';

import { object } from 'prop-types';
import { format } from 'url';

const Viewer = ({ sendMsg, state, activity }) => {
  console.log(state);

  let warningAgg = [];
  for (let i = 0; i < warningsList.length; i++) {
    warningAgg.push({ x: warningsList[i], y: state.tempAgg.warnings[i] });
  }

  let errorAgg = [];
  for (let i = 0; i < errorsList.length; i++) {
    errorAgg.push({ x: errorsList[i], y: state.tempAgg.errors[i] });
  }

  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Summary Of Group progress</h1>

      <VictoryChart>
        domainPadding={10}
        <VictoryBar horizontal barRatio={0.8} data={warningAgg} />
      </VictoryChart>

      <VictoryChart>
        <VictoryBar data={errorAgg} />
      </VictoryChart>

      <h2>List of Students</h2>

      <button className="btn btn-secondary">Increment</button>
    </div>
  );
};

const prepareDataForDisplay = state => {
  return state;
};
const errorsList = [
  'Duplicate event',
  'Missing action block',
  'Missing event block',
  'Duplicate action blocks'
];
const warningsList = [
  'No sensor specified',
  'No proximity sensor specified',
  'No ground sensor specified'
];
const cmdsList = [
  'vpl:save',
  'vpl:advanced',
  'vpl:run',
  'vpl:stop',
  'vpl:exportToHTML'
];
let Timestamp = 0;
let temp = {};
let currentID = 0;
let curTime = -1;
const mergeLog = (state, log) => {
  temp = {};
  curTime += 1;
  if (log['type'] === 'log') {
    if (!state.studentsList.includes(log['sender'].sessionid)) {
      state.tempInd.push({
        errors: new Array(errorsList.length).fill(0),
        warnings: new Array(warningsList.length).fill(0),
        cmds: new Array(cmdsList.length).fill(0)
      });
      state.studentsList.push(log['sender'].sessionid);
      currentID = state.studentsList.length - 1;
    } else {
      currentID = state.studentsList.indexOf(log['sender'].sessionid);
    }
    switch (log['data']['type']) {
      case 'vpl-changed':
        temp = {
          nrules: log['data']['data'].nrules,
          nblocks: log['data']['data'].nblocks
        };

        if (log['data']['data'].warning !== null) {
          temp.warning = log['data']['data'].warning;
          state.tempAgg.warnings[warningsList.indexOf(temp.warning)] += 1;
          state.tempInd[currentID].warnings[
            warningsList.indexOf(temp.warning)
          ] += 1;
        }

        if (log['data']['data'].error !== null) {
          temp.error = log['data']['data'].error;
          state.Time.error[curTime] = log.timestamp;
          state.tempAgg.errors[errorsList.indexOf(temp.error)] += 1;
          state.tempInd[currentID].errors[errorsList.indexOf(temp.error)] += 1;
        }

        break;
      case 'cmd':
        temp = {
          cmd: log['data']['data'].cmd,
          selected: log['data']['data'].selected
        };
        console.log(temp.cmd);
        state.tempAgg.cmds[cmdsList.indexOf(temp.cmd)] += 1;
        break;
      case 'drop':
        temp = {
          cmd: log['data']['data'].cmd
        };
        break;
      default:
    }
  }

  console.log(state);
};
const maxTime = 10;
export default {
  initData: {
    Time: { error: new Array(maxTime).fill(0) },
    studentsList: [],
    tempAgg: {
      errors: new Array(errorsList.length).fill(new Array(maxTime).fill(0)),
      warnings: new Array(warningsList.length).fill(0),
      cmds: new Array(cmdsList.length).fill(0)
    },
    tempInd: []
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
