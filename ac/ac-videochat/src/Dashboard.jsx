// @flow

import React from 'react';
import { range } from 'lodash';
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryBar } from 'victory';
import { type LogDbT, type DashboardT } from 'frog-utils';

type LogT = {
  instanceId: string,
  timestamp: Date,
  userId: string,
  type: string,
  payload: {
    name: string,
    id: string,
    speaking: boolean
  }
};

type StateT = Map<string, GroupT>;

type GroupT = {
  id: string,
  timeStart: number,
  participants: Map<string, ParticipantT>,
  tickValues: Array<number>,
  tickFormat: Array<string>,
  data: Array<{
    x: number,
    y: number,
    y0: number
  }>
};

type ParticipantT = {
  id: string,
  name: string,
  timeRanges: Array<TimeRangeT>
};

type TimeRangeT = {
  start: number,
  end: number
};

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

const prepareData = (group: GroupT) => {
  // create range of [0, 1, ..., n] - range will be number of participants + 2
  // so that graph looks nicely (it could porbably be solved with padding)
  group.tickValues = range(0, Object.keys(group.participants).length + 2);
  const tickFormat = [''];
  let counter = 1;
  Object.values(group.participants).forEach((participant: ParticipantT) => {
    participant.index = counter;
    tickFormat.push(participant.name);
    counter += 1;
  });
  // first and last element of tickFormat is empty string so that
  // graph has some empty space on y-axis
  tickFormat.push('');
  group.tickFormat = tickFormat;

  const data = [];
  Object.values(group.participants).forEach((participant: ParticipantT) => {
    participant.timeRanges.forEach((range: TimeRangeT) => {
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

const Viewer = (state: Map<string, GroupT>) => {
  // set up data for display in chart
  Object.values(state).forEach((group: GroupT) => prepareData(group));

  return (
    <React.Fragment>
      {Object.values(state).map((group: GroupT, index: number) => (
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

const mergeLog = (state: StateT, log: LogT) => {
  // set id(name) and start time of a group
  // this will be set up once for each group
  if (!state[log.instanceId]) {
    state[log.instanceId] = {
      id: log.instanceId,
      timeStart: new Date(log.timestamp).getTime() / 1000,
      participants: {},
      tickValues: [],
      tickFormat: [],
      data: []
    };
  }
  // // each user will make activityDidMount message
  // // creates new user
  if (!state[log.instanceId].participants[log.userId]) {
    state[log.instanceId].participants[log.userId] = {
      id: log.userId,
      name: '',
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

const initData: StateT = {};

const talkDashboard: DashboardT = {
  Viewer,
  mergeLog,
  initData
};

export default { talkDashboard };
