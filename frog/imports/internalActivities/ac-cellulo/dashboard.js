import * as React from 'react';

const Viewer = ({ sendMsg, state, activity }) => {
  console.log('hello');
  //console.log(state.SEND[0]);
  return (
    <div style={{ maxWidth: 500 }}>
      <h1>Classroom Summary</h1>

      <h1>List of Groups</h1>
      <h2>Group first</h2>

      <button onClick={() => sendMsg('alarm')}>Alarm</button>
    </div>
  );
};

const prepareDataForDisplay = state => state;

const mergeLog = (state, log) => {
  //console.log(log.ID["TeamNumber"]);

  console.log(log);
};

const initData = {};

export default { initData, mergeLog, prepareDataForDisplay, Viewer };
