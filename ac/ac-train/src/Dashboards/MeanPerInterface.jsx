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

const div = (x, y) => (Number.isFinite(x / y) ? x / y : 0);

const MeanPerInterface = props => {
  const { whichDash, data } = props;

  const count = data['sum']['count'];
  const dash = data['sum'][whichDash];

  const interfaces = Object.key(dash);

  if (interfaces.length > 0) {
    const allInterfaces = ['dragdrop', 'form', 'graphical', 'command'];

    const coordinates = interfaces.map(int => {
      let dashSum = 0;
      let countSum = 0;

      for (let i = 0; i < 5; i += 1) {
        dashSum += dash[int][i];
        countSum += count[int][i];
      }
      const avg = div(dashSum, countSum);

      const index = allInterfaces.indexOf(int) + 1;

      return {
        activity: index,
        name: int,
        mean: avg,
        label: `${int}-> ${avg} sec`
      };
    });

    return (
      <React.Fragment>
        <div>Mean {whichDash} per interface</div>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis
            dependentAxis
            domain={[0, 4]}
            tickValues={[1, 2, 3, 4]}
            tickFormat={allInterfaces}
          />
          <VictoryAxis />
          <VictoryBar
            horizontal
            style={{
              data: {
                fill: d => whatColor(d.name)
              }
            }}
            data={coordinates}
            x="activity"
            y="mean"
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </React.Fragment>
    );
  } else {
    return <p>No data currently</p>;
  }
};

export default MeanPerInterface;
