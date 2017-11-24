// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';

export default class ActivityRunner extends Component {
  TestList: Function;
  runit: Function;
  state: {
    inputCode: string,
    outputFeed: string,
    tests: Object
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    this.props = props;

    const testsList = this.props.activityData.config.tests;
    testsList.map((x, index) => {
      x.key = index;
      x.state = 0;
      return x;
    });

    this.state = {
      inputCode: this.props.activityData.config.templateCode,
      outputFeed: "You'll see the output here",
      tests: testsList
    };

    this.handleChange = this.handleChange.bind(this);
    this.runit = this.runit.bind(this);
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

  builtinRead(x: string) {
    if (
      window.Sk.builtinFiles === undefined ||
      window.Sk.builtinFiles['files'][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return window.Sk.builtinFiles['files'][x];
  }

  outfunction(text: string) {
    window.Sk.runner.state.outputFeed =
      window.Sk.runner.state.outputFeed + '\n' + text;
  }

  runit() {
    if (window.Sk) {
      window.Sk.runner = this;
      window.Sk.runner.state.outputFeed = '';
      window.Sk.configure({ output: this.outfunction, read: this.builtinRead });
      window.Sk.importMainWithBody('<stdin>', false, this.state.inputCode);
      this.forceUpdate();
    }
  }

  handleChange: Function;
  handleChange(event: Object) {
    this.setState({ inputCode: event.target.value });
  }

  TestList(testsList: Object) {
    return testsList.map(test => (
      <div key={test.key}>
        <p>{test.description}</p>
        <button>Run test</button>
        <p>{test.state}</p>
      </div>
    ));
  }

  render() {
    return (
      <div>
        <h2>{this.props.activityData.config.title || 'Coding activity'}</h2>
        <h3>
          {this.props.activityData.config.guidelines ||
            'No guidelines were given for this exercice'}
        </h3>
        <h3>
          {this.props.activityData.config.specifications ||
            'No specifications were given for this exercice'}
        </h3>
        <textarea
          id="yourcode"
          cols="40"
          rows="10"
          value={this.state.inputCode}
          onChange={this.handleChange}
        />
        <div>
          <button type="button" onClick={this.runit}>
            Run
          </button>
        </div>
        <p>{this.state.outputFeed}</p>
        <div>{this.TestList(this.state.tests)}</div>
      </div>
    );
  }
}
