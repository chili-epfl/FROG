// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';

export default class ActivityRunner extends Component {
  state: {
    inputCode: string,
    outputFeed: string
  };

  constructor(props: ActivityRunnerT) {
    super(props);

    this.state = {
      inputCode: 'print "Hello World"',
      outputFeed: "You'll see the output of your code here"
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

  runit: Function;
  runit() {
    if (!window.Sk) {
      window.Sk.runner = this;
      this.state.outputFeed = '';
      window.Sk.configure({ output: this.outfunction, read: this.builtinRead });
      window.Sk.importMainWithBody('<stdin>', false, this.state.inputCode);
      this.setState({ outputFeed: this.state.outputFeed });
    }
  }

  handleChange: Function;
  handleChange(event: Object) {
    this.setState({ inputCode: event.target.value });
  }

  render() {
    return (
      <div>
        <h3>Try This</h3>
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
      </div>
    );
  }
}
