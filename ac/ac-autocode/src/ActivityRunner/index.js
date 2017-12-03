// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

import Header from './Header';
import Test from './Test';
import Editor from './Editor';

const TestList = ({ tests, ...props }) =>
  tests &&
  tests.map((test, index) => (
    <Test key={test} test={test} index={index} {...props} />
  ));

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
`

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
      try {
        return window.Sk.misceval.asyncToPromise(() => {
          window.Sk.importMainWithBody('<stdin>', false, code);
        });
      } catch (e) {
        err(e);
      }
    } else {
      err('Skulpt not loaded, please check internet connection');
    }
  };

  render() {
    const { data, activityData } = this.props;
    return (
      <Main>
        <Header config={activityData.config} />
        <div>
          <Editor {...this.props} />
          <button type="button" onClick={() => console.log('Run')}>
            Run
          </button>
          {data.outputFeed && data.outputFeed.map(x => <div>{x}</div>)}
        </div>
        <div>
          <TestList
            tests={activityData.config.tests}
            runCode={this.runCode}
            {...this.props}
          />
        </div>
      </Main>
    );
  }
}
