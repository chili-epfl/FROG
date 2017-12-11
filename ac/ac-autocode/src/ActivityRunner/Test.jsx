// @flow

import React from 'react';
import { withState } from 'recompose';

const getCode = (code, preCode, postCode) =>
  [preCode, code, postCode].join('\n');

const Test = ({
  status,
  setStatus,
  setFeedback,
  test,
  index,
  runCode,
  data,
  activityData,
  logger
}: Object) => {
  let testOutput = [];
  let solutionOutput = [];

  const handleOut = w => {
    const output = w === 'student' ? testOutput : solutionOutput;
    return out => {
      if (out !== '\n') {
        output.push(out);
      }
    };
  };

  const checkSolution = () => {
    const studentOutput = testOutput.slice(-solutionOutput.length);
    for (let i = 0; i < solutionOutput.length; i += 1)
      if (solutionOutput[i] !== studentOutput[i]) {
        return {
          newStatus: 'danger',
          expected: solutionOutput[i],
          received: studentOutput[i]
        };
      }
    return { newStatus: 'success', expected: undefined, received: undefined };
  };

  const runTest = () => {
    const { preCode, postCode } = test;
    const solution = activityData.config.solution;
    const testCode = getCode(data.code, preCode, postCode);
    const solutionCode = getCode(solution, preCode, postCode);
    logger({ type: 'test', itemId: index, value: data.code });
    testOutput = [];
    solutionOutput = [];

    console.log('TESTING');
    console.log(runCode);

    runCode(testCode, handleOut('student'), () => {}).then(
      () => {
        logger({ type: testOutput[2], itemId: index });
        runCode(solutionCode, handleOut('teacher'), () => {}).then(
          () => {
            const { newStatus, expected, received } = checkSolution();
            setStatus(newStatus);
            setFeedback({
              input: preCode + '\n' + postCode,
              expected,
              received
            });
          },
          err => {
            // TEACHER ERROR
            setStatus('warning');
            const t = err.traceback;
            const a = err.args;
            const lineno = t && t[0] && t[0].lineno;
            const message = a && a.v && a.v[0] && a.v[0].v;
            const error = lineno
              ? 'On line ' + lineno + ', Received error: ' + message
              : 'Received error: ' + message;
            setFeedback({
              debug:
                'The code providing by the teacher seems incorrect, please report them the error',
              error,
              input: preCode + '\n' + postCode
            });
          }
        );
      },
      err => {
        logger({ type: 'ERROR', itemId: index });
        setStatus('danger');
        const t = err.traceback;
        const a = err.args;
        const lineno = t && t[0] && t[0].lineno;
        const message = a && a.v && a.v[0] && a.v[0].v;
        const error = lineno
          ? 'On line ' + lineno + ', Received error: ' + message
          : 'Received error: ' + message;
        setFeedback({ error, input: preCode + '\n' + postCode });
      }
    );
  };

  return (
    <button className={'btn btn-' + status} onClick={runTest}>
      TEST {index + 1}
    </button>
  );
};

export default withState('status', 'setStatus', 'default')(Test);
