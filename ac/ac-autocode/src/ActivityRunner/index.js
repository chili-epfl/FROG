// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Header from './Header';
import Editor from './Editor';
import TestPanel from './TestPanel';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  overflow: auto;
`;

export default class ActivityRunner extends Component {
  lastOut: string[];

  constructor(props: ActivityRunnerT) {
    super(props);
    this.lastOut = [];
  }

  componentDidMount() {
    const script = document.createElement('script');
    script.src = 'http://www.skulpt.org/static/skulpt.min.js';
    script.async = false;
    if (document.body != null) {
      document.body.appendChild(script);
    }

    const script2 = document.createElement('script');
    script2.src = 'http://www.skulpt.org/static/skulpt-stdlib.js';
    script2.async = false;
    if (document.body != null) {
      document.body.appendChild(script2);
    }
  }

  builtinRead = (x: string) => {
    if (
      window.Sk.builtinFiles === undefined ||
      window.Sk.builtinFiles['files'][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles['files'][x];
  };

  runCode = (code: string, out: Function, err: Function) => {
    if (window.Sk) {
      window.Sk.configure({ output: out, read: this.builtinRead });
      return window.Sk.misceval.asyncToPromise(() => {
        window.Sk.importMainWithBody('<stdin>', false, code);
      });
    } else {
      err('Skulpt not loaded, please check internet connection');
    }
  };

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
