// @flow
import React, { Component } from 'react';
import { omit, isEqual } from 'lodash';
import { type LogT } from 'frog-utils';

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  type: 'textarea' | 'textinput',
  logger?: LogT => void
};

export class ReactiveText extends Component<ReactivePropsT, ReactivePropsT> {
  textRef: any;
  binding: any;

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
      !isEqual(this.props.path, nextProps.path) ||
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

  log(msg: string, props?: ReactivePropsT) {
    const logger = props ? props.logger : this.props.logger;
    if (logger) {
      logger({
        type: 'reactivetext.' + msg,
        itemId: JSON.stringify((props || this.props).path),
        value: this.textRef.value
      });
    }
  }

  render() {
    const rest = omit(this.props, ['logger', 'path', 'dataFn']);
    return this.props.type === 'textarea' ? (
      <textarea
        ref={ref => (this.textRef = ref)}
        {...rest}
        defaultValue=""
        onBlur={() => this.log('blur')}
        onFocus={() => this.log('focus')}
      />
    ) : (
      <input
        type="text"
        ref={ref => (this.textRef = ref)}
        {...rest}
        defaultValue=""
        onBlur={() => this.log('blur')}
        onFocus={() => this.log('focus')}
      />
    );
  }
}
