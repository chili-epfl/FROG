// @flow

import * as React from 'react';
import styled from 'styled-components';
import { type ActivityRunnerPropsT } from '/imports/frog-utils';

import Header from './Header';
import Editor from './Editor';
import TestPanel from './TestPanel';
import makeRunCode from './MakeRunCode';
import HTMLrenderer from './HTMLrenderer';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
`;

class ActivityRunner extends React.Component<ActivityRunnerPropsT> {
  runCode: Function;

  handleError: Function;

  componentDidMount() {
    const { language } = this.props.activityData.config;
    if (language === 'python' || language === 'javascript') {
      const { runCode, handleError } = makeRunCode(language);
      this.runCode = runCode;
      this.handleError = handleError;
      this.forceUpdate();
    }
  }

  render() {
    console.log(this.props);
    const { config } = this.props.activityData;
    const { code } = this.props.data;
    return (
      <Main>
        <Header config={config} style={{ width: '100%' }} />
        <Editor {...this.props} />
        {config.language !== 'HTML' && (
          <TestPanel
            tests={config.tests}
            runCode={this.runCode}
            handleError={this.handleError}
            {...this.props}
          />
        )}
        {config.language === 'HTML' && <HTMLrenderer code={code} />}
      </Main>
    );
  }
}

export default ActivityRunner;
