import React, { Component } from 'react';

class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  handleChange = e => this.setState({ value: e.target.value });

  onKeyPress = e => {
    if (e.key == 'Enter') {
      this.props.callbackFn(e.target.value);
      this.setState({ value: '' });
      e.preventDefault();
    }
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
