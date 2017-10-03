// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

import { Main } from './StyledComponents';
import NavigationBar from './NavigationBar';
import Presentation from './Presentation';
import Examples from './Examples';
import Test from './TestPart/Test';
import Definition from './Definition';
import End from './End';

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const { title, examples, definition } = activityData.config;
  let page = null;
  switch (data.parts[data.indexPart]) {
    case 'Presentation':
      page = <Presentation title={title} dataFn={dataFn} data={data} />;
      break;
    case 'Examples':
      page = (
        <Examples
          title={title}
          examples={examples}
          nbExamples={activityData.config.nbExamples}
          dataFn={dataFn}
          data={data}
        />
      );
      break;
    case 'Tests with feedback':
      page = (
        <Test
          title={title}
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
      page = (
        <Definition
          title={title}
          definition={definition}
          hasTest={activityData.config.hasTest}
          dataFn={dataFn}
          data={data}
        />
      );
      break;
    case 'Tests':
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
