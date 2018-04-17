import * as React from 'react';

import {
  VictoryChart,
  VictoryBar,
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

const meanHelp = (help, count) =>
  Number.isFinite(help / count) ? help / count : 0;

const MeanTimePerInterface = props => {
  const { help, count } = props.data;

  const interfaces = Object.keys(count);

  const data = interfaces.map((int, index) => {
    let countSum = 0;

    for (let i = 0; i < 5; i += 1) {
      countSum += count[int][i];
    }

    const avg = meanHelp(help[int], countSum);

    return {
      y: avg,
      x: index + 1,
      label: int
    };
  });

  return interfaces.length > 0 ? (
    <React.Fragment>
      <div>Mean Help per interface</div>
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ y: 15 }}>
        <VictoryBar
          horizontal
          style={{ data: { fill: 'green' } }}
          categories={{ x: ['command', 'dragdrop', 'graphical', 'form'] }}
          domain={{ x: [0, 1], y: [0, 4] }}
          data={data}
        />
      </VictoryChart>
    </React.Fragment>
  ) : (
    <p>No data currently</p>
  );
};

export default MeanTimePerInterface;
