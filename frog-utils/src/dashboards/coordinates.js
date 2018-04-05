// @flow

import * as React from 'react';

import { VictoryChart, VictoryScatter, VictoryTheme } from 'victory';

import { type LogDBT, type dashboardViewerPropsT } from 'frog-utils';

const eventHandlers = [
  {
    target: 'data',
    eventHandlers: {
      onMouseOver: () => [
        {
          target: 'labels',
          mutation: p => ({ text: p.datum.name })
        }
      ],
      onMouseOut: () => [
        {
          target: 'labels',
          mutation: _ => ({ text: null })
        }
      ]
    }
  }
];

const Viewer = (props: dashboardViewerPropsT) => {
  const { users, activity, data: { coordinates } } = props;
  if (!coordinates || Object.keys(coordinates).length < 1) {
    return <p>No data to display</p>;
  } else {
    const noiseWeight = 1;
    const noise = x => x + noiseWeight * (2 * Math.random() - 1);
    const instanceName = instanceId =>
      activity.plane === 1 ? users[instanceId] : instanceId;
    const data = Object.keys(coordinates).map(k => {
      const { x, y } = coordinates[k];
      return { x: noise(x), y: noise(y), name: instanceName(k) };
    });
    return (
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ x: [-10, 10], y: [-10, 10] }}
      >
        <VictoryScatter size={4} data={data} events={eventHandlers} />
      </VictoryChart>
    );
  }
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  if (log.type === 'coordinates' && log.payload) {
    dataFn.objInsert(log.payload, ['coordinates', log.instanceId]);
  }
};

const initData = {
  coordinates: {}
};

export default { Viewer, mergeLog, initData };
