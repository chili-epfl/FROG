import React, { Component } from "react";

export const timeToPx = (time, scale) => time * 3900 * scale / 120;
export const pxToTime = (px, scale) => px / 3900 / scale * 120;

export const between = (minval, maxval, x) => {
  minval = minval || 0;
  maxval = maxval || 99999;
  return Math.min(Math.max(x, minval), maxval);
};

export class TextInput extends Component {
  constructor(props) {
    super(props);
    this.state = { val: this.props.value || "" };
  }

  componentDidMount() {
    this.textInput.focus();
  }

  onChange = e => this.setState({ val: e.target.value });

  onSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state.val);
  };

  handleKey = e => {
    if (e.keyCode === 27) {
      this.props.onCancel();
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit} onKeyDown={this.handleKey}>
        <input
          type="text"
          onChange={this.onChange}
          value={this.state.val}
          ref={input => this.textInput = input}
        />
      </form>
    );
  }
}
