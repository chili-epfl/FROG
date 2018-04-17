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

class MeanTimePerInterface extends React.Component {
  shouldComponentUpdate(nextProps) {
    return true;
  }

  render() {
    const { time, count } = this.props.data;
    const allInterfaces = ['dragdrop', 'form', 'graphical', 'command'];
    const interfaces = Object.keys(time);

    // console.log(t);

    if (interfaces.length > 0) {
      const data = interfaces.map(int => {
        let timeSum = 0;
        let countSum = 0;

        if (time[int]) {
          for (let i = 0; i < 5; i += 1) {
            timeSum += time[int][i];
            countSum += count[int][i];
          }
          const avg = meanTime(timeSum, countSum);

          const index = allInterfaces.indexOf(int) + 1;

          return {
            activity: index,
            name: int,
            mean: avg,
            label: `${int}-> ${avg} sec`
          };
        }
      });

      return (
        <React.Fragment>
          <div>Mean Time per interface</div>
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
              data={data}
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
  }
}

export default MeanTimePerInterface;
