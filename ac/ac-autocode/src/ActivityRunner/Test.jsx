// @flow

import React from 'react';
import { withState } from 'recompose';

const getTestCode = (code, solution, test) =>
  '\n' +
  code +
  '\n' +
  solution +
  '\n\nx=todo(' +
  test +
  ')\ny=solution(' +
  test +
  ')\n\nprint x\nprint y\n';


const Test = ({
  state,
  setState,
  test,
  index,
  runCode,
  data,
  activityData
}: Object) => {

  let testOutput = [];
  const handleOut = out => {
    if (out !== '\n') {
      testOutput = [testOutput[1], out];
    }
  };

  const runTest = () => {
    const testCode = getTestCode(data.code, activityData.config.solution, test);
    runCode(testCode, handleOut, console.log).then(() => {
      console.log('Its all done');
      console.log(testOutput);
      if (testOutput[0] === testOutput[1]){
        setState({ color: 'success', feedback: 'BRAVO' })
      } else {
        setState({ color: 'danger', expected: testOutput[1], received: testOutput[0]})
      }
    });
  };

  return (
    <div>
      <button
        className={'btn btn-'+state.color}
        onClick={runTest}
      >
        TEST {index+1}
      </button>
      <div>INPUT: {test}</div>
      <div>FEEDBACK: {state.feedback}</div>
    </div>
  );
};

export default withState('state', 'setState', { color: 'default', feedback: '' })(Test)
