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
  let nrulesall = {};
  let nblocksall = {};

  for (let i = 0; i < state.length; i++) {
    if (!(state[i]['ID'] in nrulesall)) {
      nrulesall[state[i]['ID']] = [];
    }
    nrulesall[state[i]['ID']].push(state[i]['nrules']);
    if (!(state[i]['ID'] in nblocksall)) {
      nblocksall[state[i]['ID']] = [];
    }
    nblocksall[state[i]['ID']].push(state[i]['nblocks']);
  }

  var index = [];
  // build the index
  for (var x in nrulesall) {
    index.push(x);
  }


  let activity1 = 'deactive';

  for (let i = 1; i < nrulesall.length - 10; i++) {
    if (
      nrulesall[nrulesall.length - 1] !== nrulesall[nrulesall.length - 1 - i]
    ) {
      activity1 = 'active';
      break;
    }
  }
  
  const tags = ['tag1', 'tag2', 'tag3'];
  function renderTags() {
    if (tags.length === 0) return <p>There are no tags!</p>;
    return (
      <ul>
        {' '}
        {tags.map(tagr => (
          <li key={tagr}>{tagr}</li>
        ))}
      </ul>
    );
  }
  return (
    /* <div>
      <h1>Number of blocks over time for Group1</h1>
      <div style={{ maxWidth: 400, maxHeight: 400, backgroundColor: 'red' }}>
        <VictoryChart>
          <VictoryLine data={sampledata} />
        </VictoryChart>
      </div>
      <div>
        Summary Of Group activity
        <h3>Group 1 {activity1}</h3>
        <h3>Group 2 {activity1}</h3>
        <h3>Group 3 {activity1}</h3>
      </div>
      <button onClick={() => sendMsg('')}>Click to send msg</button>
    </div>
 */

    <div>
      <h1>Summary Of Group progress</h1>
      <img src={imageUrl} alt="" />
      <MyNiceLookingVisualization state={state} />
      <h2>List of Students</h2>
      <div>{renderTags()}</div>
      <span style={{ fontSize: 30 }} className="badge badge-warning">
        {MyNiceLookingVisualization(state)}
      </span>
      <div style={{ maxWidth: 200, maxHeight: 200, backgroundColor: 'green' }}>
        <h3> Group 1 {activity1}</h3>
        <VictoryChart>
          <VictoryLine data={nrulesall[index[3]]} />
        </VictoryChart>

        <VictoryChart>
          <VictoryLine data={nblocksall[index[3]]} />
        </VictoryChart>
      </div>
      <div style={{ maxWidth: 200, maxHeight: 200, backgroundColor: 'red' }}>
        <h3>Group 2 {activity1}</h3>
        <VictoryChart>
          <VictoryLine data={nrulesall[index[1]]} />
        </VictoryChart>
      </div>

      {true && (
        <VictoryChart>
          <VictoryLine data={nrulesall[index[1]]} />
        </VictoryChart>
      )}
      <button className="btn btn-secondary">Increment</button>
    </div>
  );
};
const MyNiceLookingVisualization = ({ state }) => (
  <div>
    <h3>yuyggfggu</h3>
  </div>
);
const prepareDataForDisplay = state => state;
const mergeLog = (state, log) => {

  if (log['type'] === 'log') {
    if (log['data']['type'] === 'vpl-changed') {
      let temp = {  
        ID: log['sender'].sessionid,
        nrules: log['data']['data'].nrules,
        nblocks: log['data']['data'].nblocks
        warning: log['data']['data'].warning
        error: log['data']['data'].error
      };
      state.push(temp);
    }
  }
  // esltint-disable-next-line no-console
};

export default {
  initData: [],
  mergeLog,
  prepareDataForDisplay,
  Viewer
};

