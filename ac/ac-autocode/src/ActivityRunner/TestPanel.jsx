// @flow

import React from 'react';
import { withState } from 'recompose';
import { Collapse } from 'react-bootstrap';
import styled from 'styled-components';

import Test from './Test';

const CodeBox = styled.div`
  width: 300px;
  border: solid 1px;
  font-family: monospace;
  padding: 5px;
  margin-bottom: 10px;
`

const Feedback = ({ input, status, expected, received }) =>
  <div>
    INPUT
    <CodeBox>{input}</CodeBox>
    EXPECTED OUTPUT
    <CodeBox>{expected}</CodeBox>
    RECEIVED OUTPUT
    <CodeBox>{received}</CodeBox>
    STATUS
    <CodeBox>{status}</CodeBox>
  </div>

const TestList = ({ tests, ...props }) =>
  <div style={{ marginLeft: '10px', marginRight: '10px' }}>
    {tests && tests.map((test, index) => (
      <Test key={test} test={test} index={index} {...props} />
    ))}
  </div>

const TestPanel = (props: Object) => [
  <TestList key="tests" {...props}/>,
  <Feedback key="feedback" {...props.feedback}/>
]

export default withState('feedback', 'setFeedback', {})(TestPanel)
