// @flow

import React from 'react';
import { withState } from 'recompose';

const getTestCode = (code, solution, testing, test) =>
  [code, solution, test, testing].join('\n');

const Test = ({
  status,
  setStatus,
  setFeedback,
  test,
  index,
  runCode,
  data,
  activityData
}: Object) => {
  let testOutput = [];
  const handleOut = out => {
    if (out !== '\n') {
      testOutput = [testOutput[1], testOutput[2], out];
    }
  };

  const runTest = () => {
    const { solution, testing } = activityData.config;
    const testCode = getTestCode(data.code, solution, testing, test);
    runCode(testCode, handleOut, console.log).then(
      () => {
        setStatus(testOutput[2] === 'SUCCESS' ? 'success' : 'danger');
        setFeedback({
          input: test,
          status: testOutput[2],
          expected: testOutput[1],
          received: testOutput[0]
        });
      },
      err => {
        setStatus('danger');
        const t = err.traceback;
        const a = err.args;
        const lineno = t && t[0] && t[0].lineno;
        const message = a && a.v && a.v[0] && a.v[0].v;
        const error = lineno
          ? 'On line ' + lineno + ', Received error: ' + message
          : 'Received error: ' + message
        setFeedback({ error, input: test });
      }
    );
  };

  return (
    <div>
      <button className={'btn btn-' + status} onClick={runTest}>
        TEST {index + 1}
      </button>
    </div>
  );
};

export default withState('status', 'setStatus', 'default')(Test);
