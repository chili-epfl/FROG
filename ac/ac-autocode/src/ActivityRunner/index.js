// @flow

import * as React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerT } from 'frog-utils';

import Header from './Header';
import Editor from './Editor';
import TestPanel from './TestPanel';
import makeRunCode from './MakeRunCode';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
`;

export default class ActivityRunner extends React.Component<ActivityRunnerT> {
  runCode: Function;
  handleError: Function;

  componentDidMount() {
    const { runCode, handleError } = makeRunCode(
      this.props.activityData.config.language
    );
    this.runCode = runCode;
    this.handleError = handleError;
    this.forceUpdate();
  }

  render() {
    const { config } = this.props.activityData;
    return (
      <Main className="bootstrap">
        <Header config={config} style={{ width: '100%' }} />
        <Editor {...this.props} />
        <TestPanel
          tests={config.tests}
          runCode={this.runCode}
          handleError={this.handleError}
          {...this.props}
        />
      </Main>
    );
  }
}
