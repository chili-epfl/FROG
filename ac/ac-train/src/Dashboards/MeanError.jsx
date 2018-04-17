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

const calcErrorRate = (wrong, count) =>
  Number.isFinite(wrong / count) ? wrong / count : 0;

const MeanError = props => {
  const { error, count } = props.data['sum'];
  const coordinates = [];
  for (let i = 0; i < 20; i += 1) {
    coordinates.push({
      x: i,
      y: calcErrorRate(error[i], count[i])
    });
  }

  return (
    <React.Fragment>
      <div>Mean error</div>
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ y: 15 }}>
        <VictoryLine
          domain={{ x: [0, 20], y: [0, 1] }}
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

export default MeanError;
