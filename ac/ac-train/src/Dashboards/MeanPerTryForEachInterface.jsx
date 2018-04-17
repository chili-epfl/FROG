import * as React from 'react';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTheme,
  VictoryLabel
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

const MeanPerTryForEachInterface = props => {
  const { whichDash, data } = props;

  const count = data['count'];
  const dash = data[whichDash];

  const interfaces = Object.keys(dash);

  if (interfaces.length > 0) {
    const allCoordinates = interfaces.map(int => {
      const coordinates = [];
      for (let i = 0; i < 5; i += 1) {
        coordinates.push({
          x: i,
          y: div(dash[int][i], count[int][i]),
          fill: color(int)
        });
      }
      return {
        name: int,
        coordinates
      };
    });

    const legend = allCoordinates.map(int => {
      return {
        name: int.name,
        symbol: { fill: color(int.name) }
      };
    });

    const domain =
      whichDash === 'error' ? { x: [0, 4], y: [0, 1] } : { x: [0, 4] };

    return (
      <React.Fragment>
        <div>Mean {whichDash} Per Try For Each Interface</div>
        <VictoryChart theme={VictoryTheme.material}>
          <VictoryLegend
            x={125}
            y={50}
            title="Legend"
            centerTitle
            orientation="vertical"
            gutter={20}
            style={{ border: { stroke: 'black' }, title: { fontSize: 20 } }}
            data={legend}
          />
          {data.map(int => (
            <VictoryLine
              key={int.name}
              domain={domain}
              style={{
                data: { stroke: color(int.name) },
                parent: { border: '1px solid #ccc' }
              }}
              data={int.coordinates}
            />
          ))}
        </VictoryChart>
      </React.Fragment>
    );
  } else {
    return <p>No data currently</p>;
  }
};

export default MeanPerTryForEachInterface;
