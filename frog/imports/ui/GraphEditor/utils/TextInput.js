// @flow
import React, { Component } from 'react';

export default class TextInput extends Component {
  constructor(props: { value: string, onChange: Function }) {
    super(props);
    this.state = { val: this.props.value || '' };
  }

  state: { val: string };

  componentDidMount() {
    this.textInput.focus();
  }

  componentWillReceiveProps(nextProps: any) {
    if (this.props.value !== nextProps.value) {
      this.setState({ val: nextProps.value || '' });
    }
  }

  onChange = (e: any) => {
    this.setState({ val: e.target.value });
    this.props.onChange(e.target.value);
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.val);
  };

  textInput: { focus: Function };

  handleKey = (e: any) => {
    if (e.keyCode === 27) {
      e.preventDefault();
      this.props.onCancel();
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} onBlur={this.onSubmit}>
        <input
          type="text"
          onChange={this.onChange}
          onKeyDown={this.handleKey}
          value={this.state.val}
          ref={input => this.textInput = input}
        />
      </form>
    );
  }
}
