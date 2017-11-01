// @flow

import React from 'react';
import { type LogDBT } from 'frog-utils';

const actionTypes = ['subPart', 'part'];
const partsNames = [
  'Presentation',
  'Examples',
  'TestFeedback',
  'Definition',
  'Test'
];

const Viewer = ({ instances, data, config }: Object) => {
  const parts = [
    1,
    config.hasExamples ? config.nbExamples : 0,
    config.hasTestWithFeedback ? config.nbTestFeedback : 0,
    config.hasDefinition ? 1 : 0,
    config.hasTest ? config.nbTest : 0
  ];
  const nbInst = Object.keys(instances).length; // need to change to have the instance instead of the users
  return (
    <div>
      <div>% of the part done by all instances: </div>
      <div style={{ display: 'flex', flexDirectioon: 'row', margin: '10px' }}>
        {parts.map(
          (x, i) =>
            x > 0 ? (
              <div
                key={x.toString() + i.toString()}
                style={{ flexDirectioon: 'column' }}
              >
                <div>{partsNames[i]}</div>
                <div
                  className="progress"
                  style={{ width: x > 0 ? '150px' : '0px' }}
                >
                  <div
                    className="progress-bar progress-bar-striped"
                    role="progressbar"
                    aria-valuenow={Math.round(
                      100 * data[partsNames[i]][0] / (nbInst * x)
                    )}
                    aria-valuemin="0"
                    aria-valuemax="100"
                    style={{
                      width:
                        Math.round(
                          100 * data[partsNames[i]][0] / (nbInst * x)
                        ).toString() + '%'
                    }}
                  >
                    {Math.round(
                      100 * data[partsNames[i]][0] / (nbInst * x)
                    ).toString() + '%'}
                  </div>
                </div>
              </div>
            ) : (
              <div key={x.toString() + i.toString()} />
            )
        )}
      </div>
      <div>% of the instances that are done with the part: </div>
      <div style={{ display: 'flex', flexDirectioon: 'row', margin: '10px' }}>
        {parts.map(
          (x, i) =>
            x > 0 ? (
              <div
                key={x.toString() + i.toString()}
                style={{ flexDirectioon: 'column' }}
              >
                <div>{partsNames[i]}</div>
                <div
                  className="progress"
                  style={{ width: x > 0 ? '150px' : '0px' }}
                >
                  {x > 0 && (
                    <div
                      className="progress-bar progress-bar-striped"
                      role="progressbar"
                      aria-valuenow={Math.round(
                        100 * data[partsNames[i]][1] / nbInst
                      )}
                      aria-valuemin="0"
                      aria-valuemax="100"
                      style={{
                        width:
                          Math.round(
                            100 * data[partsNames[i]][1] / nbInst
                          ).toString() + '%'
                      }}
                    >
                      {Math.round(
                        100 * data[partsNames[i]][1] / nbInst
                      ).toString() + '%'}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key={x.toString() + i.toString()} />
            )
        )}
      </div>
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
