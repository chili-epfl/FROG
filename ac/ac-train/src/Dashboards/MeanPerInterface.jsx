// @flow

import * as React from 'react';

import {
  VictoryChart,
  VictoryBar,
  VictoryTheme,
  VictoryTooltip,
  VictoryAxis
} from 'victory';

const color = (c: string) => {
  switch (c) {
    case 'graphical':
      return '#96E283';
    case 'command':
      return '#E2E062';
    case 'form':
      return '#8BB0DD';
    case 'dragdrop':
      return '#C192C4';
    default:
      break;
  }
};

const div = (x, y) => (Number.isFinite(x / y) ? x / y : 0);

const MeanPerInterface = props => {
  const { whichDash, data } = props;

  const count = data['count'];
  const dash = data[whichDash];

  const interfaces = Object.keys(dash);

  if (interfaces.length > 0) {
    const allInterfaces = ['dragdrop', 'form', 'graphical', 'command'];

    const coordinates = interfaces.map(int => {
      if (whichDash === 'help') {
        let countSum = 0;

        for (let i = 0; i < 5; i += 1) {
          countSum += count[int][i];
        }

        const avg = div(dash[int], countSum);
        const index = allInterfaces.indexOf(int) + 1;

        return {
          interface: index,
          avg,
          name: int
        };
      } else {
        let dashSum = 0;
        let countSum = 0;

        for (let i = 0; i < 5; i += 1) {
          dashSum += dash[int][i];
          countSum += count[int][i];
        }

        const avg = div(dashSum, countSum);
        const index = allInterfaces.indexOf(int) + 1;

        return {
          interface: index,
          avg,
          name: int,
          label: `${int}-> ${avg} sec`
        };
      }
    });

    const xDomain = whichDash === 'error' ? [0, 1] : null;

    return (
      <React.Fragment>
        <div>Mean {whichDash} per interface</div>
        <VictoryChart theme={VictoryTheme.material} domainPadding={20}>
          <VictoryAxis
            dependentAxis
            tickValues={[1, 2, 3, 4]}
            tickFormat={allInterfaces}
          />
          <VictoryAxis domain={xDomain} />
          <VictoryBar
            horizontal
            style={{
              data: {
                fill: d => color(d.name)
              }
            }}
            data={coordinates}
            x="interface"
            y="avg"
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
