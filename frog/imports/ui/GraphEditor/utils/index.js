// @flow
import React, { Component } from 'react';

export const timeToPx = (time: number, scale: number): number => time * 3900 * scale / 120;
export const pxToTime = (px: number, scale: number): number => px / 3900 / scale * 120;

export const between = (rawminval: number, rawmaxval: number, x: number): number => {
  const minval = rawminval || 0;
  const maxval = rawmaxval || 99999;
  return Math.min(Math.max(x, minval), maxval);
};

export class TextInput extends Component {
  constructor(props: { value: string }) {
    super(props);
    this.state = { val: this.props.value || '' };
  }

  state: { val: string } 

  componentDidMount() {
    this.textInput.focus();
  }

  onChange = (e: any) => this.setState({ val: e.target.value });

  onSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit(this.state.val);
  };
  textInput: { focus: Function }

  handleKey = (e: any) => {
    if (e.keyCode === 27) {
      this.props.onCancel();
    }
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
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
