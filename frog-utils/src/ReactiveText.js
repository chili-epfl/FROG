// @flow
import React, { Component } from 'react';
import { omit } from 'lodash';

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  type: 'textarea' | 'textinput'
};

export class ReactiveText extends Component {
  textRef: any;
  binding: any;
  state: ReactivePropsT;

  update = (props: ReactivePropsT) => {
    this.setState({ path: props.path, dataFn: props.dataFn });
    if (this.binding) {
      this.binding.destroy();
    }
    this.binding = props.dataFn.bindTextField(this.textRef, props.path);
  };

  componentDidMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps: ReactivePropsT) {
    if (
      (nextProps.dataFn && nextProps.dataFn.doc.id) !==
        (this.props.dataFn && this.props.dataFn.doc.id) ||
      this.props.path !== nextProps.path ||
      this.props.type !== nextProps.type
    ) {
      this.update(nextProps);
    }
  }

  componentWillUnmount() {
    if (this.binding) {
      this.binding.destroy();
    }
  }

  render() {
    const rest = omit(this.props, ['path', 'dataFn']);
    return this.props.type === 'textarea'
      ? <textarea ref={ref => (this.textRef = ref)} {...rest} defaultValue="" />
      : <input
          type="text"
          ref={ref => (this.textRef = ref)}
          {...rest}
          defaultValue=""
        />;
  }
}
