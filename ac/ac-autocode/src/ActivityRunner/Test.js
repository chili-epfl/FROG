// @flow

import * as React from 'react';
import { withState } from 'recompose';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import green from '@material-ui/core/colors/green';

const styles = {
  containedPrimary: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  root: { margin: '5px' }
};

const Test = ({
  status,
  setStatus,
  setFeedback,
  test,
  index,
  runCode,
  handleError,
  data,
  activityData,
  logger,
  classes
}: Object) => {
  let testOutput = [];
  let solutionOutput = [];

  const lengthLines = (preCode: string) =>
    preCode ? preCode.split('\n').length : 1;

  const getCode = (code, preCode, postCode) =>
    [preCode, code, postCode].join('\n');

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
          newStatus: 'secondary',
          expected: '' + solutionOutput[i],
          received: '' + studentOutput[i]
        };
      }
    return {
      newStatus: 'primary',
      expected: undefined,
      received: studentOutput
    };
  };

  const runTest = () => {
    const { preCode, postCode, inputDesc } = test;
    const solution = activityData.config.solution;
    const testCode = getCode(data.code, preCode, postCode);
    const solutionCode = getCode(solution, preCode, postCode);
    testOutput = [];
    solutionOutput = [];
    runCode(solutionCode, handleOut('teacher')).then(
      () => {
        runCode(testCode, handleOut('student')).then(
          () => {
            // Both code ran without error, checkSolution compare the outputs and assign the values for feedback
            const { newStatus, expected, received } = checkSolution();
            logger({
              type: 'test',
              itemId: index,
              value: newStatus,
              payload: data.code
            });
            setStatus(newStatus);
            setFeedback({
              inputDesc,
              expected,
              received,
              error: undefined,
              stdout: undefined
            });
          },
          err => {
            // Student error
            logger({
              type: 'test',
              itemId: index,
              value: 'error',
              payload: data.code
            });
            setStatus('secondary');
            const error = handleError(err, lengthLines(preCode));
            setFeedback({ error, inputDesc });
          }
        );
      },
      err => {
        // Teacher code error
        setStatus('secondary');
        const error = handleError(err, lengthLines(preCode));
        setFeedback({
          stdout: [
            'The code provided by the teacher seems incorrect, please report them the error'
          ],
          error,
          inputDesc
        });
      }
    );
  };
  return (
    <Button
      disableRipple
      disableFocusRipple
      classes={classes}
      variant="contained"
      color={status}
      onClick={runTest}
    >
      TEST {index + 1}
    </Button>
  );
};

const StyledTest = withStyles(styles)(Test);
StyledTest.displayName = 'TestButtons';

const DefaultExport: React.ComponentType<*> = withState(
  'status',
  'setStatus',
  undefined
)(StyledTest);

export default DefaultExport;
