// @flow

import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

const styles = {
  textInput: {
    fontSize: '12pt',
    padding: '20px',
    borderRadius: '5px',
    border: '1px solid lightgrey',
    resize: 'none'
  }
};

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
      <textarea
        rows="2"
        cols="50"
        type="text"
        className={this.props.classes.textInput}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyPress={this.onKeyPress}
      />
    );
  }
}

export default withStyles(styles)(TextInput);
