// @flow

import React, { Component } from 'react';
import type { ActivityRunnerT } from 'frog-utils';

export default class ActivityRunner extends Component {
  state: {
    outputFeed: string[]
  };
  outputFeed: string[];
  Ace: React$Component<*, *, *>;

  constructor(props: ActivityRunnerT) {
    super(props);

    this.state = {
      outputFeed: ["You'll see the output of your code here"]
    };

    this.editorChange = this.editorChange.bind(this);
    this.runit = this.runit.bind(this);

    if (window !== undefined) {
      this.Ace = require('react-ace').default;
      require('brace/mode/python');
      require('brace/theme/textmate');
      require('brace/ext/language_tools');
    }
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

  outfunction = (output: string) => {
    this.outputFeed = [...this.outputFeed, output];
  };

  runit: Function;
  runit() {
    if (window.Sk) {
      this.outputFeed = [];
      window.Sk.configure({ output: this.outfunction, read: this.builtinRead });
      window.Sk.importMainWithBody('<stdin>', false, this.props.data.code);
      this.setState({ outputFeed: this.outputFeed });
    }
  }

  editorChange: Function;
  editorChange(newValue: string) {
    this.props.dataFn.objInsert(newValue, 'code');
  }

  render() {
    const { data, activityData } = this.props;
    return (
      <div>
        <h3>{activityData.config.title}</h3>
        <span>{activityData.config.guidelines}</span>
        <this.Ace
          id="yourcode"
          mode="python"
          theme="textmate"
          highlightActiveLine
          value={data.code}
          onChange={this.editorChange}
          setOptions={{
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false,
            showLineNumbers: true,
            tabSize: 4
          }}
        />
        <div>
          <button type="button" onClick={this.runit}>
            Run
          </button>
        </div>
        {this.state.outputFeed.map((line, i) => (
          <div key={line + i}>{line}</div>
        ))}
      </div>
    );
  }
}
