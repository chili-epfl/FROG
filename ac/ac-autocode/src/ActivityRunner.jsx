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

    this.editorChange = this.editorChange.bind(this);
    this.runit = this.runit.bind(this);
  }

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    if (this.state.inputCode !== nextState.inputCode) {
      return false;
    } else {
      return true;
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

  outfunction(text: string) {
    window.Sk.runner.state.outputFeed =
      window.Sk.runner.state.outputFeed + '\n' + text;
  }

  runit: Function;
  runit() {
    if (window.Sk) {
      window.Sk.runner = this;
      window.Sk.runner.state.outputFeed = '';
      window.Sk.configure({ output: this.outfunction, read: this.builtinRead });
      window.Sk.importMainWithBody('<stdin>', false, this.state.inputCode);
      this.props.logger({
        type: 'runScript',
        value: this.state.inputCode.trim(),
        payload: { output: this.state.outputFeed.trim() }
      });
      this.forceUpdate();
    }
  }

  editorChange: Function;
  editorChange(newValue: string) {
    this.setState({ inputCode: newValue });
  }

  render() {
    const Editor = props => {
      if (window !== undefined) {
        const Ace = require('react-ace').default;
        require('brace/mode/python');
        require('brace/theme/monokai');
        require('brace/ext/language_tools');
        return <Ace {...props} />;
      }
      return (
        <textarea
          id="yourcode"
          cols="40"
          rows="10"
          value={this.state.inputCode}
          onChange={this.editorChange}
        />
      );
    };

    return (
      <div>
        <h3>{this.props.activityData.config.title}</h3>
        <p>{this.props.activityData.config.guidelines}</p>
        <Editor
          id="yourcode"
          mode="python"
          theme="monokai"
          highlightActiveLine
          value={this.state.inputCode}
          onChange={this.editorChange}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            showLineNumbers: true,
            tabSize: 2
          }}
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
