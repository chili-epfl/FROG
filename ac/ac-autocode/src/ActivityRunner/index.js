// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Header from './Header';
import Editor from './Editor';
import TestPanel from './TestPanel';
import makeRunCode from './MakeRunCode';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
`;

export default class ActivityRunner extends Component {
  runCode: Function;

  componentDidMount() {
    this.runCode = makeRunCode(this.props.activityData.config.language);
    this.forceUpdate();
  }

  render() {
    const { config } = this.props.activityData;
    return (
      <Main>
        <Header config={config} style={{ width: '100%' }} />
        <Editor {...this.props} />
        <TestPanel
          tests={config.tests}
          runCode={this.runCode}
          {...this.props}
        />
      </Main>
    );
  }
}
