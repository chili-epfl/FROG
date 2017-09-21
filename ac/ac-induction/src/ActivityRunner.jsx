// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

import { Main } from './StyledComponents';
import NavigationBar from './NavigationBar';
import Presentation from './Presentation';
import Examples from './Examples';
import Test from './Test';
import Definition from './Definition';
import End from './End';

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const { title, examples } = activityData.config;

  let page = null;
  switch (data.parts[data.indexPart]) {
    case 'Presentation':
      page = <Presentation title={title} dataFn={dataFn} data={data} />;
      break;
    case 'Examples':
      page = (
        <Examples
          examples={examples}
          nbExamples={activityData.config.nbExamples}
          dataFn={dataFn}
          data={data}
        />
      );
      break;
    case 'Test with feedback':
      page = (
        <Test
          examples={examples}
          nbTest={0}
          nbTestFeedback={activityData.config.nbTestFeedback}
          feedback
          dataFn={dataFn}
          data={data}
        />
      );
      break;
    case 'Definition':
      page = <Definition dataFn={dataFn} data={data} />;
      break;
    case 'Test':
      page = (
        <Test
          examples={examples}
          nbTest={activityData.config.nbTest}
          nbTestFeedback={0}
          feedback={false}
          dataFn={dataFn}
          data={data}
        />
      );
      break;
    case 'End':
      page = <End />;
      break;
    default:
  }

  return (
    <Main>
      <NavigationBar config={activityData.config} data={data} />
      {page}
    </Main>
  );
};
