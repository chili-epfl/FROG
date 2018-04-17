import * as React from 'react';

import {
  VictoryChart,
  VictoryLine,
  VictoryLegend,
  VictoryTheme,
  VictoryLabel
} from 'victory';

const div = (x, y) => (Number.isFinite(x / y) ? x / y : 0);

const MeanThrougOutStudy = props => {
  const { whichDash, data } = props;

  const count = data['sum']['count'];
  const dash = data['sum'][whichDash];

  const coordinates = [];
  for (let i = 0; i < 20; i += 1) {
    coordinates.push({
      x: i,
      y: div(dash[i], count[i])
    });
  }

  const domain =
    whichDash === 'time' ? { x: [0, 20] } : { x: [0, 20], y: [0, 1] };

  return (
    <React.Fragment>
      <div>Mean {whichDash} throughout study</div>
      <VictoryChart theme={VictoryTheme.material} domainPadding={{ y: 15 }}>
        <VictoryLine
          domain={domain}
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

export default MeanThrougOutStudy;
