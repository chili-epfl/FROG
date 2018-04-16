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

const meanError = (wrong, count) =>
  Number.isFinite(wrong / count) ? wrong / count : 0;

const ErrorPerInterface = props => {
  const errorObj = props.data['error'];
  const interfaces = Object.keys(errorObj);

  const data = interfaces.map(int => {
    const { wrong, count } = errorObj[int];
    const coordinates = [];

    for (let i = 0; i < 5; i += 1) {
      coordinates.push({
        x: i,
        y: meanError(wrong[i], count[i]),
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
      <div>Mean error per try for each interface</div>
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
            domain={{ x: [0, 4], y: [0, 1] }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
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

export default ErrorPerInterface;
