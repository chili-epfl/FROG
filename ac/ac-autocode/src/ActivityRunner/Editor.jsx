import React, { Component } from 'react';

type EditorPropsT = {
  Ace: React$Component<any>,
  mode: String,
  data: any,
  dataFn: any
};

export default class Editor extends Component<EditorPropsT> {
  constructor(props: Object) {
    super(props);
    this.Ace = require('react-ace').default;
    this.mode = props.activityData.config.language;
    switch (props.activityData.config.language) {
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
        mode={this.props.activityData.config.language || 'javascript'}
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
