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
  switch (data.parts && data.parts[data.indexPart]) {
    case 'Presentation':
      page = <Presentation {...{ title, dataFn, data, logger }} />;
      break;
    case 'Examples':
      page = (
        <Examples
          {...{ title, examples, dataFn, data, logger }}
          nbExamples={activityData.config.nbExamples}
        />
      );
      break;
    case 'Tests with feedback':
      page = (
        <Test
          {...{
            title,
            examples,
            properties,
            dataFn,
            data,
            logger
          }}
          nbTest={0}
          nbTestFeedback={activityData.config.nbTestFeedback}
          feedback
        />
      );
      break;
    case 'Definition':
      page = (
        <Definition
          {...{ title, definition, dataFn, data, logger }}
          hasTest={activityData.config.hasTest}
        />
      );
      break;
    case 'Tests':
      page = (
        <Test
          {...{
            title,
            examples,
            properties,
            dataFn,
            data,
            logger
          }}
          nbTest={activityData.config.nbTest}
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
