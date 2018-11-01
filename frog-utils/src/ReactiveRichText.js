// @flow
import React, { Component } from 'react';
import { get, isEqual, first, last } from 'lodash';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

type ReactivePropsT = {
  path: string,
  dataFn: Object,
  data?: Object,
  readOnly?: boolean,
  toolbarOptions?: Object[]
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],

  ['link', 'image', 'video']
];

export class ReactiveRichText extends Component<
  ReactivePropsT,
  { path: ?((string | number)[]) }
> {
  quillRef: any;
  state = { path: undefined };

  opListener = (op: Object[], source: string) => {
    if (source === this.quillRef) {
      return;
    }
    const opPath = last(first(op).p);
    if (this.quillRef && opPath === this.props.path) {
      this.quillRef.getEditor().setContents(this.getDocumentContent(this.props))
    }
  };

  update = (props: ReactivePropsT) => {
    props.dataFn.doc.on('op', this.opListener);
  };

  getDocumentContent = (props: ReactivePropsT) => get(
    props.data
      ? { payload: props.data }
      : props.dataFn.doc.data,
    (this.state.path || []).join('.')
  );

  componentDidMount() {
    this.update(this.props);
  }

  componentWillMount() {
    this.props.dataFn && this.setState({ path: this.props.dataFn.getMergedPath(this.props.path) });
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

  shouldComponentUpdate() {
    return !!this.props.readOnly;
  }

  componentWillUnmount() {
    this.props.dataFn.doc.removeListener('op', this.opListener);
  }

  handleChange = (contents: string, delta: Object, source: string) => {
    const op = {
      p: this.state.path,
      t: 'rich-text',
      o: delta.ops
    };

    if (source !== 'user') {
      return;
    }

    this.props.dataFn.doc.submitOp([op], { source: this.quillRef });
  };

  render() {
    return (
      <div>
        <ReactQuill
          defaultValue={this.getDocumentContent(this.props)}
          ref={element => {
            this.quillRef = element;
          }}
          readOnly={this.props.readOnly}
          onChange={this.handleChange}
          modules={{
            toolbar: this.props.readOnly
              ? null
              : this.props.toolbarOptions || toolbarOptions
          }}
        >
          <div style={this.props.readOnly ? { borderStyle: 'hidden' } : {}} />
        </ReactQuill>
      </div>
    );
  }
}
