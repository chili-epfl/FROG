// @flow

import React from 'react';
import { withState } from 'recompose';

const getTestCode = (code, solution, testing, test) =>
  ['', code, solution, test, testing].join('\n')

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
      console.log(testOutput)
    }
  };

  const runTest = () => {
    const { solution, testing } = activityData.config
    const testCode = getTestCode(data.code, solution, testing, test);
    console.log(testCode)
    runCode(testCode, handleOut, console.log).then(() => {
      console.log('Its all done');
      console.log(testOutput);
      if (testOutput[2] === 'SUCCESS'){
        setStatus('success')
      } else {
        setStatus('danger')
      }
      setFeedback({
        input: test,
        status: testOutput[2],
        expected: testOutput[1],
        received: testOutput[0]
      })
    });
  };

  return (
    <div>
      <button
        className={'btn btn-'+status}
        onClick={runTest}
      >
        TEST {index+1}
      </button>
    </div>
  );
};

export default withState('status', 'setStatus', 'default')(Test)
