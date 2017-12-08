// @flow

import React from 'react';
import { type LogDBT } from 'frog-utils';

import { ListComponent } from './DashboardComponents';

const actionTypes = ['subPart', 'part', 'unSubPart'];

const Viewer = ({ instances, data, config }: Object) => {
  const parts = [
    1,
    config.hasExamples ? config.nbExamples : 0,
    config.hasTestWithFeedback ? config.nbTestFeedback : 0,
    config.hasDefinition ? 1 : 0,
    config.hasTest ? config.nbTest : 0
  ];

  const nbInst = Object.keys(instances).length;
  return (
    <div>
      <ListComponent
        title="% of the part done by all instances: "
        lineNb={0}
        {...{ parts, data, nbInst }}
      />
      <ListComponent
        title="% of the instances that are done with the part: "
        lineNb={1}
        {...{ parts, data, nbInst }}
      />
    </div>
  );
};

const mergeLog = (data: any, dataFn: Object, log: LogDBT) => {
  switch (log.type) {
    case actionTypes[0]:
      dataFn.objInsert(
        [data[log.value][0] + 1, data[log.value][1]],
        [log.value]
      );
      break;
    case actionTypes[1]:
      dataFn.objInsert(
        [data[log.value][0], data[log.value][1] + 1],
        [log.value]
      );
      break;
    case actionTypes[2]:
      dataFn.objInsert(
        [data[log.value][0] - 1, data[log.value][1]],
        [log.value]
      );
      break;
    default:
  }
};

const initData = {
  Presentation: [0, 0],
  Examples: [0, 0],
  TestFeedback: [0, 0],
  Definition: [0, 0],
  Test: [0, 0]
};

export default {
  Viewer,
  mergeLog,
  initData
};
