import * as React from 'react';

const Viewer = ({ sendMsg, state, activity }) => (
  <div>
    <div>
      <h3>Activity info: </h3>
      {JSON.stringify(activity)}
    </div>
    <div>
      <h3>Received logs</h3>
      {state.map((x, i) => (
        <li key={i}>{JSON.stringify(x)}</li>
      ))}
    </div>
    <button onClick={() => sendMsg('hello from dashboard ' + Date.now())}>
      Click to send msg
    </button>
  </div>
);

const prepareDataForDisplay = state => state;

const mergeLog = (state, log) => {
  console.log('Merging log message', log);
  state.push(log);
};

export default { initData: [], mergeLog, prepareDataForDisplay, Viewer };
