// @flow

import React from 'react';
import { range } from 'lodash';
import { VictoryChart, VictoryTheme, VictoryAxis, VictoryBar } from 'victory';
import { type DashboardT, values, type LogDbT } from 'frog-utils';

type StateT = { [group: string]: GroupT };

type GroupT = {
  id?: string,
  timeStart: number,
  participants: { [id: string]: ParticipantT },
  tickValues?: number[],
  tickFormat?: string[],
  data: {
    x: number,
    y: number,
    y0: number
  }[]
};

type ParticipantT = {
  id: string,
  index: number,
  name: string,
  timeRanges: Array<TimeRangeT>
};

type TimeRangeT = {
  start: number,
  end: number | null
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
  values(group.participants).forEach((participant: ParticipantT) => {
    participant.index = counter;
    tickFormat.push(participant.name);
    counter += 1;
  });
  // first and last element of tickFormat is empty string so that
  // graph has some empty space on y-axis
  tickFormat.push('');
  group.tickFormat = tickFormat;

  const data = [];
  values(group.participants).forEach((participant: ParticipantT) => {
    participant.timeRanges.forEach((prange: TimeRangeT) => {
      if (prange.end != null) {
        data.push({
          x: participant.index,
          y: prange.end,
          y0: prange.start
        });
      }
    });
  });
  group.data = data;
};

const Viewer = ({ state }) => {
  // set up data for display in chart
  values((state: any)).forEach((group: any) => prepareData(group));

  return (
    <React.Fragment>
      {values((state: any)).map((group: any) => (
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

const mergeLog = (state: StateT, log: LogDbT) => {
  // set id(name) and start time of a group
  // this will be set up once for each group
  if (!log.instanceId) {
    return;
  }
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
      timeRanges: [],
      index: 0
    };
  }
  const payload = log.payload;
  if (log.type === 'videochat' && payload) {
    const startTime = state[log.instanceId].timeStart;
    const currentTime = new Date(log.timestamp).getTime() / 1000;
    const relativeTime = currentTime - startTime;
    if (!state[log.instanceId].participants[log.userId].name) {
      state[log.instanceId].participants[log.userId].name = payload.name;
    }
    if (payload.speaking) {
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
