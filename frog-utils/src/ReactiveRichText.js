// @flow
import React, { Component } from 'react';
import { get, isEqual, last } from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { type LogT } from 'frog-utils';

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  logger?: LogT => void,
  readOnly: boolean,
  toolbarOptions?: Object[]
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']
];

export class ReactiveRichText extends Component<ReactivePropsT, ReactivePropsT> {

  quillRef: any;

  opListener = (op, source) => {
    if (source === this.quillRef) {
      return;
    }
    op.forEach(operation => {
      const opPath = last(operation.p);
      if (this.quillRef && opPath === this.props.path) {
        this.quillRef.getEditor().updateContents(operation.o);
      }
    });
  };

  update = (props: ReactivePropsT) => {
    props.dataFn.doc.on('op', this.opListener);
  };

  componentDidMount() {
    this.update(this.props);
  }

  componentWillReceiveProps(nextProps: ReactivePropsT) {
    if (
      (nextProps.dataFn && nextProps.dataFn.doc.id) !==
      (this.props.dataFn && this.props.dataFn.doc.id) ||
      !isEqual(this.props.path, nextProps.path)
    ) {
      this.update(nextProps);
    }
  }

  componentWillUnmount() {
    this.props.dataFn.doc.removeListener('op', this.opListener);
  }

  log(msg: string, props?: ReactivePropsT) {
    const logger = props ? props.logger : this.props.logger;

    if (logger && !this.props.dataFn.readOnly) {
      const editor = this.quillRef.getEditor();
      const unprivilegedEditor = this.quillRef.makeUnprivilegedEditor(editor);

      logger({
        type: 'reactivetext.' + msg,
        itemId: JSON.stringify((props || this.props).path),
        value: unprivilegedEditor.getText()
      });
    }
  }

  handleChange = (contents, delta, source) => {
    const op = {
      p: ['payload', this.props.path],
      t:'rich-text',
      o: delta.ops
    };

    if (source !== 'user') return;

    this.props.dataFn.doc.submitOp([op], {source: this.quillRef});
  };

  render() {
    return (
      <div>
        <ReactQuill
          defaultValue={get(this.props.dataFn.doc.data, `payload.${this.props.path}`)}
          ref={element => { this.quillRef = element }}
          readOnly={this.props.readOnly}
          onChange={this.handleChange}
          modules={{
            toolbar: this.props.readOnly ? null : (this.props.toolbarOptions || toolbarOptions)
          }}
        >
          <div style={this.props.readOnly ? { 'borderStyle': 'hidden' } : {}}/>
        </ReactQuill>
      </div>
    );
  }
}
