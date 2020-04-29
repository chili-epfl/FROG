import React, { Component } from 'react';
import Ace from 'react-ace';

type EditorPropsT = {
  data: any,
  dataFn: any
};

const style = {
  flex: '1 0 360px',
  height: '420px',
  margin: '2px solid black'
};

export default class Editor extends Component<EditorPropsT> {
  constructor(props: Object) {
    super(props);
    const { language, theme } = props.activityData.config;
    if (language === 'python') require('brace/mode/python');
    if (language === 'javascript') require('brace/mode/javascript');
    if (language === 'HTML') require('brace/mode/html');
    if (theme === 'monokai') require('brace/theme/monokai');
    if (theme === 'github') require('brace/theme/github');
    if (theme === 'tomorrow') require('brace/theme/tomorrow');
    if (theme === 'kuroir') require('brace/theme/kuroir');
    if (theme === 'twilight') require('brace/theme/twilight');
    if (theme === 'textmate') require('brace/theme/textmate');
    if (theme === 'xcode') require('brace/theme/xcode');
    if (theme === 'solarized_dark') require('brace/theme/solarized_dark');
    if (theme === 'solarized_light') require('brace/theme/solarized_light');
    if (theme === 'terminal') require('brace/theme/terminal');
    require('brace/ext/language_tools');
  }

  onChange = (newValue: string) => {
    this.props.dataFn.objInsert(newValue, 'code');
  };

  render() {
    const { language, theme } = this.props.activityData.config;
    return (
      <Ace
        editorProps={{
          $blockScrolling: Infinity
        }}
        id="yourcode"
        style={style}
        mode={(language && language.toLowerCase()) || 'javascript'}
        theme={theme}
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
