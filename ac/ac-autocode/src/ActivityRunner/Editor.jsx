// @flow

import React, { Component } from 'react';

export default class Editor extends Component {
  Ace: React$Component<*, *, *>;
  mode: String;

  constructor(props: Object) {
    super(props);
    this.Ace = require('react-ace').default;
    this.mode = props.activityData.config.language;
    switch (this.mode) {
      case 'python':
        require('brace/mode/python');
        break;
      case 'javascript':
      default:
        require('brace/mode/javascript');
        break;
    }
    require('brace/theme/textmate');
    require('brace/ext/language_tools');
  }

  onChange = (newValue: string) => {
    this.props.dataFn.objInsert(newValue, 'code');
  };

  render() {
    return (
      <this.Ace
        id="yourcode"
        style={{ width: '600px', height: '750px' }}
        mode={this.mode || 'javascript'}
        theme="textmate"
        highlightActiveLine
        value={this.props.data.code}
        onChange={this.onChange}
        setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          showLineNumbers: true,
          tabSize: 4
        }}
      />
    );
  }
}
