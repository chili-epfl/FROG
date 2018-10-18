// @flow
import React, { Component } from 'react';
import { get, omit, isEqual } from 'lodash';
import Quill from 'quill';
import { type LogT } from 'frog-utils';

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  type: 'textarea' | 'textinput',
  logger?: LogT => void
};

export class ReactiveRichText extends Component<ReactivePropsT, ReactivePropsT> {
  textRef: any;

  update = (props: ReactivePropsT) => {
    this.setState({ path: props.path, dataFn: props.dataFn });
  };

  componentDidMount() {
    const quill = new Quill(this.textRef);
    quill.setContents(this.props.dataFn.doc.data['payload'][this.props.path]);
    console.log('data', this.props.dataFn.doc.data);
    console.log('path', this.props.path);
    quill.on('text-change', (delta, oldDelta, source) => {
      console.log("delta", delta);

      const op = {
        p: ['payload', this.props.path],
        t:'rich-text',
        o: delta.ops
      };
      if (source !== 'user') return;
      console.log("op", op);

      this.props.dataFn.doc.submitOp([op]);
    });
    this.props.dataFn.doc.on('op', (op, source) => {
      console.log('received op', op, 'source', source);
      if (source) return;
      op.forEach(operation => {
        quill.updateContents(operation.o);
      });
    });
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps: ReactivePropsT) {
    console.log(nextProps.dataFn);
    if (
      (nextProps.dataFn && nextProps.dataFn.doc.id) !==
      (this.props.dataFn && this.props.dataFn.doc.id) ||
      !isEqual(this.props.path, nextProps.path) ||
      this.props.type !== nextProps.type
    ) {
      this.update(nextProps);
    }
  }
  //
  // componentWillUnmount() {
  //   if (this.binding) {
  //     this.binding.destroy();
  //   }
  // }

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
    const rest = omit(this.props, ['logger', 'path', 'dataFn']);
    if (this.props.dataFn.readOnly) {
      rest.value = get(this.props.dataFn.doc.data, this.props.path);
      rest.readOnly = true;
      rest.defaultValue = undefined;
    }
    return (
      <div className="bootstrap">
        <div {...rest} id="ql-editor" ref={ref => (this.textRef = ref)}/>
      </div>
    );
  }
}
