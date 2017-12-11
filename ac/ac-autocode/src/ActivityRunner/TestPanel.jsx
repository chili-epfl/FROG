// @flow

import React from 'react';
import { withState } from 'recompose';
import styled from 'styled-components';

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

const Feedback = ({ input, expected, received, error, stdout, debug }) => (
  <div>
    {[
      input && <div key="inputT">INPUT</div>,
      input && <CodeBox key="inputB">{renderLines(input)}</CodeBox>,
      debug && <div key="debugT">CONSOLE OUTPUT</div>,
      debug && <CodeBox key="debugB">{renderLines(stdout.join('\n'))}</CodeBox>,
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
    <Debug key="debug" {...props} />
    {tests.map((test, index) => {
      test.id = index;
      return <Test key={test.id} test={test} index={index} {...props} />;
    })}
  </ButtonList>
);

const Debug = ({ data, runCode, setFeedback, logger }) => {
  const debug = () => {
    const stdout = [];
    logger({ type: 'debug', value: data.code });
    runCode(data.code, out => stdout.push(out), () => {}).then(
      () => {
        setFeedback({ stdout, debug: true });
      },
      err => {
        logger({ type: 'ERROR', itemId: 'debug' });
        const t = err.traceback;
        const a = err.args;
        const lineno = t && t[0] && t[0].lineno;
        const message = a && a.v && a.v[0] && a.v[0].v;
        const error = lineno
          ? 'On line ' + lineno + ', Received error: ' + message
          : 'Received error: ' + message;
        setFeedback({ error, stdout, debug: true, status: 'ERROR' });
      }
    );
  };
  return (
    <button className="btn btn-primary" onClick={debug}>
      DEBUG
    </button>
  );
};

const TestPanel = (props: Object) => [
  <TestList key="tests" {...props} />,
  <Feedback key="feedback" {...props.feedback} />
];

export default withState('feedback', 'setFeedback', {})(TestPanel);
