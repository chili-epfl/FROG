import * as React from 'react';

const Viewer = ({ sendMsg, state, activity }) => {
  console.log('hello');
  //console.log(state.SEND[0]);
  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Classroom Summary of Robots movement</h1>

      <h1>Aggregated heatmap</h1>

      <button onClick={() => sendMsg('alarm')}>Alarm</button>
    </div>
  );
};

const prepareDataForDisplay = state => state;
const NumberTeams = 2;
const mergeLog = (state, log) => {
  console.log(log);
  state.position.x[log.ID.TeamNumber] = log.Payload.positionx;
  state.position.y[log.ID.TeamNumber] = log.Payload.positiony;
  console.log(state);
};
export default {
  initData: {
    studentsList: [],
    position: {
      x: new Array(NumberTeams).fill(0),
      y: new Array(NumberTeams).fill(0),
      theta: new Array(NumberTeams).fill(0)
    }
  },
  mergeLog,
  prepareDataForDisplay,
  Viewer
};
