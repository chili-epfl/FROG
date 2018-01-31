// @flow

import React, { Component } from 'react';

type TextInputStateT = {
  value: string
};

class TextInput extends Component<Object, TextInputStateT> {
  constructor(props: { callbackFn: Function }) {
    super(props);
    this.state = {
      value: ''
    };
  }

  onKeyPress = (e: Object) => {
    if (e.key === 'Enter') {
      this.props.callbackFn(e.target.value);
      this.setState({ value: '' });
      e.preventDefault();
    }
  };

  handleChange = (e: { target: { value: string } }) => {
    this.setState({ value: e.target.value });
  };

  render() {
    return (
      <input
        type="text"
        value={this.state.value}
        onChange={this.handleChange}
        onKeyPress={this.onKeyPress}
      />
    );
  }
}

export default TextInput;
