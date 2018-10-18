// @flow
import React, { Component } from 'react';
import { omit, isEqual } from 'lodash';
import Quill from 'quill';
import { type LogT } from 'frog-utils';

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  logger?: LogT => void,
  readOnly: boolean
};

export class ReactiveRichText extends Component<ReactivePropsT, ReactivePropsT> {
  textRef: any;

  binding: any;

  update = (props: ReactivePropsT) => {
    this.setState({ path: props.path, dataFn: props.dataFn });

    const editor = new Quill(this.textRef, { readOnly: this.props.readOnly });

    if (this.binding) {
      this.binding.destroy();
    }
    if (!this.props.dataFn.readOnly) {
      this.binding = props.dataFn.bindRichTextEditor(editor, props.path);
    }
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
    if (logger && !this.props.dataFn.readOnly) {
      logger({
        type: 'reactivetext.' + msg,
        itemId: JSON.stringify((props || this.props).path),
        value: this.textRef.value
      });
    }
  }

  render() {
    const rest = omit(this.props, ['logger', 'path', 'dataFn', 'readOnly']);
    return (
      <div {...rest} ref={ref => (this.textRef = ref)}/>
    );
  }
}
