// @flow

import React, { Component } from 'react';

export default class Editor extends Component {
  Ace: React$Component<*, *, *>;

  constructor(props: Object) {
    super(props);
    this.Ace = require('react-ace').default;
    require('brace/mode/python');
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
        mode="python"
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
