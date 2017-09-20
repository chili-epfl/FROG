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
    hasTest
  } = activityData.config;
  const parts = ['Presentation'];
  if (hasExamples) parts.push('Examples');
  if (hasTestWithFeedback) parts.push('Test with feedback');
  if (hasDefinition) parts.push('Definition');
  if (hasTest) parts.push('Test');

  let page = null;
  switch (parts[data.index]) {
    case 'Presentation':
      page = (
        <Presentation title={title} parts={parts} dataFn={dataFn} data={data} />
      );
      break;
    case 'Examples':
      page = <Examples />;
      break;
    case 'Test with feedback':
      page = <Test feedback />;
      break;
    case 'Definition':
      page = <Definition />;
      break;
    case 'Test':
      page = <Test feedback={false} />;
      break;
    default:
  }

  return (
    <div>
      <NavigationBar active={data.index} parts={parts} />
      {page}
    </div>
  );
};
