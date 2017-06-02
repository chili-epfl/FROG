// @flow
import React, { Component } from 'react';
import { A } from 'frog-utils';

export default class TextInput extends Component {
  constructor(props: { value: string, onChange: Function, style?: string }) {
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
    this.props.onChange && this.props.onChange(e.target.value);
  };

  onSubmit = (e: any) => {
    e.preventDefault();
    this.props.onSubmit && this.props.onSubmit(this.state.val);
  };

  textInput: { focus: Function };

  handleKey = (e: any) => {
    if (e.keyCode === 27) {
      e.preventDefault();
      this.props.onCancel && this.props.onCancel();
    }
    if (e.keyCode === 13) {
      this.props.onSubmit && this.props.onSubmit(this.state.val);
    }
  };

  render() {
    return (
      <input
        type="text"
        onChange={this.onChange}
        onKeyDown={this.handleKey}
        value={this.state.val}
        ref={input => (this.textInput = input)}
        onSubmit={this.onSubmit}
        onBlur={this.onSubmit}
        style={this.props.style}
      />
    );
  }
}

export class ChangeableText extends Component {
  constructor(props) {
    super(props);
    this.state = { edit: false, value: this.props.text };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id !== nextProps.id) {
      this.setState({ edit: false, value: nextProps.text });
    }
  }

  state: { edit: boolean, value: string };

  render() {
    const { EditComponent = TextInput, ...rest } = this.props;
    if (this.state.edit) {
      return (
        <EditComponent
          value={this.state.value}
          {...rest}
          onSubmit={e => {
            this.setState({ edit: false, value: e });
            this.props.onChange(e);
          }}
        />
      );
    } else {
      return (
        <span>
          <A onClick={() => this.setState({ edit: true })}>
            <i className="fa fa-pencil" />
          </A>
          &nbsp;{this.state.value}
        </span>
      );
    }
  }
}
