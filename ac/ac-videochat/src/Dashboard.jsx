// @flow

import React from 'react';
import { range } from 'lodash';
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryBar } from 'victory';

// type TimeRangeT = {
//     start: number,
//     end: number
// };

// type ParticipantT = {
//     id: string,
//     name: string,
//     timeRanges: Array<TimeRangeT>
// };

// type GroupChartT = {
//     id: string,
//     timeStart: number,
//     participants: Array<ParticipantT>
// };

// type ViewerStateT = Array<GroupChartT>;

// type ViewerStateT = Array<{
//     id: string,
//     timeStart: number,
//     participants: Array<{
//         id: string,
//         name: string,
//         timeRanges: Array<{
//             start: number,
//             end: number
//         }>
//     }>
// }>;

const styles = {
  axisStyle: {
    axisLabel: {
      fontSize: 14,
      padding: 30
    }
  },
  divStyle: {
    width: '400px',
    display: 'flex',
    flexWrap: 'wrap'
  }
};

const prepareData = group => {
  // create range of [0, 1, ..., n] - range will be number of participants + 2
  // so that graph looks nicely (it could porbably be solved with padding)
  group.tickValues = range(0, Object.keys(group.participants).length + 2);
  const tickFormat = [''];
  let counter = 1;
  Object.values(group.participants).forEach(participant => {
    participant.index = counter;
    tickFormat.push(participant.name);
    counter += 1;
  });
  // first and last element of tickFormat is empty string so that
  // graph has some empty space on y-axis
  tickFormat.push('');
  group.tickFormat = tickFormat;

  const data = [];
  Object.values(group.participants).forEach(participant => {
    participant.timeRanges.forEach(range => {
      if (range.end != null) {
        data.push({
          x: participant.index,
          y: range.end,
          y0: range.start
        });
      }
    });
  });
  group.data = data;
};

const Viewer = ({ state }: Object) => {
  // set up data for display in chart
  Object.values(state).forEach(group => prepareData(group));

  return (
    <React.Fragment>
      {Object.values(state).map((group, index) => (
        <div style={styles.divStyle} key={group.id}>
          <VictoryChart theme={VictoryTheme.material}>
            <VictoryAxis label="Time (sec)" style={styles.axisStyle} />
            <VictoryAxis
              dependentAxis
              tickValues={group.tickValues}
              tickFormat={group.tickFormat}
              style={styles.axisStyle}
            />
            <VictoryBar horizontal data={group.data} />
          </VictoryChart>
        </div>
      ))}
    </React.Fragment>
  );
};

const mergeLog = (state, log) => {
  // set id(name) and start time of a group
  // this will be set up once for each group
  if (!state[log.instanceId]) {
    state[log.instanceId] = {
      id: log.instanceId,
      timeStart: new Date(log.timestamp).getTime() / 1000,
      participants: {}
    };
  }

  // each user will make activityDidMount message
  // creates new user
  if (!state[log.instanceId].participants[log.userId]) {
    state[log.instanceId].participants[log.userId] = {
      id: log.userId,
      timeRanges: []
    };
  }

  if (log.type === 'videochat') {
    const startTime = state[log.instanceId].timeStart;
    const currentTime = new Date(log.timestamp).getTime() / 1000;
    const relativeTime = currentTime - startTime;

    if (!state[log.instanceId].participants[log.userId].name) {
      state[log.instanceId].participants[log.userId].name = log.payload.name;
    }

    if (log.payload.speaking) {
      // if we missed the last time user stopped talking
      // TODO what to do?
      const timeRanges =
        state[log.instanceId].participants[log.userId].timeRanges;
      if (timeRanges.length > 0) {
        if (!timeRanges[timeRanges.length - 1].end) {
          timeRanges[timeRanges.length - 1].end =
            timeRanges[timeRanges.length - 1].start;
        }
      }

      state[log.instanceId].participants[log.userId].timeRanges.push({
        start: relativeTime,
        end: null
      });
    } else {
      // update end of last time range
      const timeRanges =
        state[log.instanceId].participants[log.userId].timeRanges;
      timeRanges[timeRanges.length - 1].end = relativeTime;
    }
  }
};

const initData = {};

export default {
  Viewer,
  mergeLog,
  initData
};
