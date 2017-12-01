// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';
import ActivityHeaders from './ActivityHeaders';

export default class ActivityRunner extends Component {
  TestList: Function;
  handleChange: Function;
  debugRun: Function;
  runTest: Function;
  runit: Function;
  state: {
    inputCode: string,
    outputFeed: string[],
    tests: Object
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    this.props = props;

    const testsList = this.props.activityData.config.tests;
    testsList.map((x, index) => {
      x.key = index;
      x.state = 'Not tested';
      return x;
    });

    this.state = {
      inputCode: this.props.activityData.config.templateCode,
      outputFeed: ["You'll see the output of your code here"],
      tests: testsList
    };

    this.handleChange = this.handleChange.bind(this);
    this.runit = this.runit.bind(this);
    this.runTest = this.runTest.bind(this);
    this.debugRun = this.debugRun.bind(this);
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

  debugRun() {
    this.state.outputFeed = [];
    try {
      this.runit(this, this.state.inputCode);
    } catch (err) {
      this.outfunction(err.toString());
    }
    this.forceUpdate();
  }

  builtinRead(x: string) {
    if (
      window.Sk.builtinFiles === undefined ||
      window.Sk.builtinFiles['files'][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles['files'][x];
  }

  outfunction(text: string) {
    window.Sk.runner.state.outputFeed.push(text);
  }

  runit(comp: Object, code: string) {
    if (window.Sk) {
      window.Sk.runner = comp;
      window.Sk.configure({ output: comp.outfunction, read: comp.builtinRead });
      try {
        window.Sk.importMainWithBody('<stdin>', false, code);
      } catch (err) {
        throw err;
      }
    } else {
      this.outfunction('Skulpt not loaded, please check internet connection');
    }
  }

  handleChange(event: Object) {
    this.setState({ inputCode: event.target.value });
  }

  runTest(comp: Object, i: number) {
    return function() {
      const test = comp.state.tests[i];
      const testCode =
        test.preCode + '\n' + comp.state.inputCode + '\n' + test.postCode;

      comp.state.outputFeed = [];
      try {
        comp.runit(comp, testCode);
      } catch (err) {
        comp.outfunction(err.toString());
      }

      let answer;
      if (test.onlyLastPrint) {
        answer = comp.state.outputFeed[comp.state.outputFeed.length - 2];
      } else {
        answer = comp.state.outputFeed.reduce((a, b) => a + b);
      }

      if (answer === test.expectedPrint) {
        test.state = 'Passed';
        comp.outfunction('Test ' + i + ' was successful');
      } else {
        test.state = 'Failed';
        comp.outfunction('Test ' + i + ' was failed');
        if (test.showExpected) {
          comp.outfunction('Got: ' + answer);
          comp.outfunction('Expected: ' + test.expectedPrint);
        }
      }
      comp.forceUpdate();
    };
  }

  TestList(testsList: Object) {
    return testsList.map(test => (
      <div key={test.key}>
        <p>{test.description}</p>
        <button type="button" onClick={this.runTest(this, test.key)}>
          Run test {test.key}
        </button>
        <p>{test.state}</p>
      </div>
    ));
  }

  render() {
    const columnStyle = {
      float: 'left',
      width: '50%'
    };

    return (
      <div>
        {ActivityHeaders(this.props.activityData.config)}
        <div style={columnStyle}>
          <textarea
            id="yourcode"
            cols="40"
            rows="10"
            value={this.state.inputCode}
            onChange={this.handleChange}
          />
          <div>
            <button type="button" onClick={this.debugRun}>
              Run
            </button>
          </div>
          {this.state.outputFeed.map(x => <div>{x}</div>)}
        </div>
        <div style={columnStyle}>{this.TestList(this.state.tests)}</div>
      </div>
    );
  }
}
