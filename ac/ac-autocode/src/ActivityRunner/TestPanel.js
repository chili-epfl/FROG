// @flow

import React from 'react';
import { withState } from 'recompose';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';

import Test from './Test';

const renderLines = (text: string) =>
  text &&
  text
    .split('\n')
    .filter(x => x)
    .map((x, index) => (
      <div key={x} index={index}>
        {x}
      </div>
    ));

const CodeBox = styled.div`
  min-width: 300px;
  max-width: 400px;
  border: solid 1px;
  font-family: monospace;
  padding: 5px;
  margin-bottom: 15px;
`;

const ButtonList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin-left: 10px;
  margin-right: 10px;
`;

const Feedback = ({ inputDesc, expected, received, error, stdout }) => (
  <div>
    {[
      inputDesc && <div key="inputDescT">INPUT</div>,
      inputDesc && <CodeBox key="inputDescB">{renderLines(inputDesc)}</CodeBox>,
      stdout && <div key="stdoutT">CONSOLE OUTPUT</div>,
      stdout && <CodeBox key="stdoutB">{renderLines(stdout.join(''))}</CodeBox>,
      expected && <div key="expectedT">EXPECTED OUTPUT</div>,
      expected && <CodeBox key="expectedB">{expected}</CodeBox>,
      received && <div key="receivedT">RECEIVED OUTPUT</div>,
      received && <CodeBox key="receivedB">{received}</CodeBox>,
      error && <div key="errorT">ERROR</div>,
      error && <CodeBox key="errorB">{error}</CodeBox>
    ]}
  </div>
);

const TestList = ({ tests, ...props }) => (
  <ButtonList>
    <DebugStyled key="debug" {...props} />
    {tests &&
      tests.map((test, index) => (
        <Test key={index} test={test} index={index} {...props} /> // eslint-disable-line
      ))}
  </ButtonList>
);

const Debug = ({
  data,
  runCode,
  setFeedback,
  logger,
  handleError,
  classes
}) => {
  const debug = () => {
    const stdout = [];
    runCode(data.code, out => stdout.push(out), () => {}).then(
      () => {
        logger({
          type: 'debug',
          itemId: -1,
          value: 'success',
          payload: data.code
        });
        setFeedback({ stdout });
      },
      err => {
        logger({
          type: 'debug',
          itemId: -1,
          value: 'danger',
          payload: data.code
        });
        const error = handleError(err, 0);
        setFeedback({ error, stdout, status: 'ERROR' });
      }
    );
  };
  return (
    <Button
      disableRipple
      disableFocusRipple
      variant="contained"
      classes={classes}
      onClick={debug}
    >
      RUN
    </Button>
  );
};

const styles = { root: { margin: '5px' } };

const DebugStyled = withStyles(styles)(Debug);

const TestPanel = (props: Object) => [
  <TestList key="tests" {...props} />,
  <Feedback key="feedback" {...props.feedback} />
];

export default withState('feedback', 'setFeedback', {})(TestPanel);
