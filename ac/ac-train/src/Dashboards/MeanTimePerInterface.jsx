import * as React from 'react';

import {
  VictoryChart,
  VictoryBar,
  VictoryLegend,
  VictoryTheme,
  VictoryLabel,
  VictoryTooltip,
  VictoryAxis
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

const meanTime = (time, count) =>
  Number.isFinite(time / count) ? time / count : 0;

const MeanTimePerInterface = props => {
  const { time, count } = props.data;

  const interfaces = Object.keys(count);
  let max = 0;

  const data = interfaces.map((int, index) => {
    let timeSum = 0;
    let countSum = 0;

    for (let i = 0; i < 5; i += 1) {
      timeSum += time[int][i];
      countSum += count[int][i];
    }

    const avg = meanTime(timeSum, countSum);

    max = Math.max(max, avg);

    return {
      activity: int,
      mean: avg,
      label: `${int}-> ${avg} sec`
    };
  });

  return interfaces.length > 0 ? (
    <React.Fragment>
      <div>Mean Time per interface</div>
      <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
        <VictoryAxis />
        <VictoryAxis
          tickValues={[1, 2, 3, 4]}
          dependentAxis
          tickFormat={['command', 'dragdrop', 'form', 'graphic']}
        />
        <VictoryBar
          horizontal
          style={{ data: { fill: 'red' } }}
          data={data}
          x="activity"
          y="mean"
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>
    </React.Fragment>
  ) : (
    <p>No data currently</p>
  );
};

export default MeanTimePerInterface;
