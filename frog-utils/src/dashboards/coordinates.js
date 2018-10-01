// @flow

import * as React from 'react';

import {
  VictoryChart,
  VictoryScatter,
  VictoryTheme,
  VictoryLabel
} from 'victory';

import { type LogDbT, type DashboardViewerPropsT } from 'frog-utils';

const target = 'labels';
const onMouseOver = () => ({ target, mutation: p => ({ text: p.datum.name }) });
const onMouseOut = () => ({ target, mutation: _ => ({ text: '' }) });
const eventHandlers = { onMouseOver, onMouseOut };
const eventHandler = [{ target: 'data', eventHandlers }];

const Viewer = (props: DashboardViewerPropsT) => {
  const { users, activity, state } = props;
  const { coordinates } = state;
  const coordinateLabels = activity.data.answers || [];
  if (!coordinates || Object.keys(coordinates).length < 1) {
    return <p>No data to display</p>;
  } else {
    const noise = x => x + 0.5 * (2 * Math.random() - 1);
    const instanceName = ins => (activity.plane === 1 ? users[ins] : ins);
    const data = Object.keys(coordinates).map(k => {
      const { x, y } = coordinates[k];
      return { x: noise(x), y: noise(y), label: '', name: instanceName(k) };
    });
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ x: [-10, 10], y: [-10, 10] }}
      >
        <VictoryLabel
          key={coordinateLabels[0]}
          x={300}
          y={40}
          textAnchor="end"
          style={{ title: { fontSize: 16 } }}
          text={coordinateLabels[0]}
        />
        <VictoryLabel
          key={coordinateLabels[1]}
          x={300}
          y={310}
          textAnchor="end"
          style={{ title: { fontSize: 16 } }}
          text={coordinateLabels[1]}
        />
        <VictoryLabel
          key={coordinateLabels[2]}
          x={50}
          y={40}
          style={{ title: { fontSize: 16 } }}
          text={coordinateLabels[2]}
        />
        <VictoryLabel
          key={coordinateLabels[3]}
          x={50}
          y={310}
          style={{ title: { fontSize: 16 } }}
          text={coordinateLabels[3]}
        />
        <VictoryScatter size={4} data={data} events={eventHandler} />
      </VictoryChart>
    );
  }
};

const mergeLog = (state: any, log: LogDbT) => {
  if (log.type === 'coordinates' && log.payload) {
    state.coordinates[log.instanceId] = log.payload;
  }
};

const initData = {
  coordinates: {}
};

export default { Viewer, mergeLog, initData };
