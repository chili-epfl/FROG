// @flow

import React, { Component } from "react";
import type { ActivityRunnerT } from "frog-utils";

export default class ActivityRunner extends Component {
  constructor(props: ActivityRunnerT) {
    super(props);
  }

  componentDidMount() {
    const script = document.createElement("script");

    script.src = "http://www.skulpt.org/static/skulpt.min.js";
    script.async = false;
    document.body.appendChild(script);

    const script2 = document.createElement("script");
    script2.src = "http://www.skulpt.org/static/skulpt-stdlib.js";
    script2.async = false;
    document.body.appendChild(script2);
  }

  builtinRead(x) {
    if (
      Sk.builtinFiles === undefined ||
      Sk.builtinFiles["files"][x] === undefined
    )
      throw "File not found: '" + x + "'";
    return Sk.builtinFiles["files"][x];
  }

  outfunction(text) {
    this.feedback.innerHTML = this.feedback.innerHTML + text;
  }

  runit() {
    let prog = this.yourcode.value;
    Sk.feedback = this.output;
    Sk.feedback.innerHTML = "";
    Sk.configure({ output: this.outfunction, read: this.builtinRead });
    Sk.importMainWithBody("<stdin>", false, prog);
  }

  render() {
    return (
      <div>
        <h3>Try This</h3>
        <textarea
          id="yourcode"
          ref={ref => {
            this.yourcode = ref;
          }}
          cols="40"
          rows="10"
          defaultValue="print [i for i in range(5)]"
        />
        <div>
          <button type="button" onClick={this.runit.bind(this)}>
            Run
          </button>
        </div>
        <p
          id="output"
          ref={ref => {
            this.output = ref;
          }}
        >
          Output
        </p>
      </div>
    );
  }
}
