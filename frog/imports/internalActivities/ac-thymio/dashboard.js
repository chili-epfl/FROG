import * as React from 'react';
import {
  VictoryBar,
  VictoryGroup,
  VictoryChart,
  VictoryLabel,
  VictoryAxis,
  VictoryTheme
} from 'victory';
const Viewer = ({ sendMsg, state, activity }) => {
  const sampleData = [];
  for (var j = 0; j < Object.keys(state).length; j++) {
    sampleData.push({
      x: j + 1,
      y: state[j + 1][state[j + 1]['length'] - 1].LastTargetBattery + 2
    });
  }

  const sampleData1 = [];
  for (var i = 0; i < state[1]['length']; i++) {
    sampleData1.push({
      x: i,
      y: state[1][i].LastTargetBattery + 2
    });
  }
  //console.log(state.SEND[0]);
  return (
    <div>
      <h1>Classroom Summary</h1>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryBar style={{ data: { fill: '#c43a31' } }} data={sampleData} />
      </VictoryChart>

      <h1>List of Groups</h1>
      <h2>Group first</h2>
      <VictoryChart theme={VictoryTheme.material} domainPadding={10}>
        <VictoryBar style={{ data: { fill: '#c43a31' } }} data={sampleData1} />
      </VictoryChart>
      {/* {state.logList.map((x, i) => (
          <li key={i}>{JSON.stringify(x)}</li>
        ))} */}
      <button onClick={() => sendMsg('waiting')}>Pause robots</button>
      <button onClick={() => sendMsg('alarm')}>Alarm</button>
    </div>
  );
};

const prepareDataForDisplay = state => state;

const mergeLog = (state, log) => {
  //console.log(log.ID["TeamNumber"]);
  if (!(log.ID.TeamNumber in state)) {
    state[log.ID.TeamNumber] = [];
  }
  state[log.ID.TeamNumber].push(log.Payload);
  console.log(Object.keys(state).length);
};

const initData = {};

export default { initData, mergeLog, prepareDataForDisplay, Viewer };
