import * as React from 'react';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTheme,
  VictoryLabel
} from 'victory';

const whatColor = color => {
  switch (color) {
    case 'graphical':
      return 'green';
    case 'command':
      return 'blue';
    case 'form':
      return 'red';
    case 'dragdrop':
      return 'orange';
    default:
      break;
  }
};

const calcAvgTime = (time, count) =>
  Number.isFinite(time / count) ? time / count : 0;

const MeanTime = props => {
  const { time, count } = props.data['sum'];
  const coordinates = [];
  for (let i = 0; i < 20; i += 1) {
    coordinates.push({
      x: i,
      y: calcAvgTime(time[i], count[i])
    });
  }

  return (
    <React.Fragment>
      <div>Mean Time</div>
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ y: 15 }}>
        <VictoryLine
          domain={{ x: [0, 20] }}
          style={{
            data: { stroke: 'blue' },
            parent: { border: '1px solid #ccc' }
          }}
          data={coordinates}
        />
      </VictoryChart>
    </React.Fragment>
  );
};

export default MeanTime;
