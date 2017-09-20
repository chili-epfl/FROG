// @flow

import React from 'react';
import type { ActivityRunnerT } from 'frog-utils';

import NavigationBar from './NavigationBar';
import Presentation from './Presentation';
import Examples from './Examples';
import Definition from './Definition';
import Test from './Test';

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const {
    title,
    hasExamples,
    hasTestWithFeedback,
    hasDefinition,
    hasTest,
    examples
  } = activityData.config;
  const parts = ['Presentation'];
  if (hasExamples) parts.push('Examples');
  if (hasTestWithFeedback) parts.push('Test with feedback');
  if (hasDefinition) parts.push('Definition');
  if (hasTest) parts.push('Test');

  let page = null;
  switch (parts[data.indexPart]) {
    case 'Presentation':
      page = (
        <Presentation title={title} parts={parts} dataFn={dataFn} data={data} />
      );
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
    default:
  }

  return (
    <div>
      <NavigationBar active={data.indexPart} parts={parts} />
      {page}
    </div>
  );
};
