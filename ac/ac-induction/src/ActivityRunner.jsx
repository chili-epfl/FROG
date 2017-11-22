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

export default ({ activityData, data, dataFn, logger }: ActivityRunnerT) => {
  const { title, examples, definition, properties } = activityData.config;
  let page = null;
  switch (data.parts && data.parts[data.indexPart][0]) {
    case 'Presentation':
      page = <Presentation {...{ title, dataFn, data, logger }} />;
      break;
    case 'Examples':
      page = (
        <Examples
          {...{ title, examples, dataFn, data, logger }}
          nbExamples={data.parts[data.indexPart][1]}
        />
      );
      break;
    case 'Tests with feedback':
      page = (
        <Test
          {...{ title, examples, properties, dataFn, data, logger }}
          nbTest={0}
          nbTestFeedback={data.parts[data.indexPart][1]}
          feedback
        />
      );
      break;
    case 'Definition':
      page = <Definition {...{ title, definition, dataFn, data, logger }} />;
      break;
    case 'Tests':
      page = (
        <Test
          {...{ title, examples, properties, dataFn, data, logger }}
          nbTest={data.parts[data.indexPart][1]}
          nbTestFeedback={0}
          feedback={false}
        />
      );
      break;
    case 'End':
      page = <End {...{ data, dataFn }} />;
      break;
    default:
      page = <h1>...</h1>;
      break;
  }

  return (
    <Main>
      <NavigationBar config={activityData.config} data={data} />
      {page}
    </Main>
  );
};
