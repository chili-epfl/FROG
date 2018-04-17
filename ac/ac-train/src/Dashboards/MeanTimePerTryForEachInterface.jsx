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

const meanTime = (time, count) =>
  Number.isFinite(time / count) ? time / count : 0;

const MeanTimePerTryForEachInterface = props => {
  const { time, count } = props.data;
  const interfaces = Object.keys(count);

  const data = interfaces.map(int => {
    const coordinates = [];

    for (let i = 0; i < 5; i += 1) {
      coordinates.push({
        x: i,
        y: meanTime(time[int][i], count[int][i]),
        fill: whatColor(int)
      });
    }

    const specificCharcData = {
      name: int,
      coordinates
    };
    return specificCharcData;
  });

  return interfaces.length > 0 ? (
    <React.Fragment>
      <div>Mean Time Per Try For Each Interface</div>
      <VictoryChart theme={VictoryTheme.material}>
        <VictoryLegend
          x={125}
          y={50}
          title="Legend"
          centerTitle
          orientation="vertical"
          gutter={20}
          style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
          data={data.map(int => {
            const obj = {
              name: int.name,
              symbol: { fill: whatColor(int.name) }
            };
            return obj;
          })}
        />
        {data.map(int => (
          <VictoryLine
            key={int.name}
            domain={{ x: [0, 4] }}
            style={{
              data: { stroke: whatColor(int.name) },
              parent: { border: '1px solid #ccc' }
            }}
            data={int.coordinates}
          />
        ))}
      </VictoryChart>
    </React.Fragment>
  ) : (
    <p>No data currently</p>
  );
};

export default MeanTimePerTryForEachInterface;
