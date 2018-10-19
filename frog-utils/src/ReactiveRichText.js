// @flow
import React, { Component } from 'react';
import { get, isEqual } from 'lodash';
import ReactQuill from 'react-quill';
import classNames from 'classnames';
import uuid from 'uuid/v4';
import 'react-quill/dist/quill.snow.css';
import { type LogT } from 'frog-utils';
import { withStyles } from '@material-ui/core/styles';

const styles = () => ({
  hidden: {
    display: 'none'
  }
});

type ReactivePropsT = {
  path: string | string[],
  dataFn: Object,
  logger?: LogT => void,
  readOnly: boolean
};

const Toolbar = withStyles(styles)(({editorId, hidden, classes}) => (
    <div className={classNames(hidden && classes.hidden)} id={`toolbar-${editorId}`}>
      <select className="ql-header" onChange={e => e.persist()}/>
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
      <button className="ql-script" value="sub"/>
      <button className="ql-script" value="super"/>
      <button className="ql-code-block" />
      <button className="ql-blockquote" />
      <button className="ql-list" value="ordered"/>
      <button className="ql-list" value="bullet"/>
      <button className="ql-indent" value="-1"/>
      <button className="ql-indent" value="+1"/>
      <select className="ql-font"/>
      <select className="ql-color"/>
      <select className="ql-background"/>
    </div>
  )
);

const modules = editorId => ({
  toolbar: {
    container: `#toolbar-${editorId}`
  }
});

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'script',
  'background'
];

export class ReactiveRichText extends Component<ReactivePropsT, ReactivePropsT> {

  quillRef: any;

  opListener = (op, source) => {
    if (source === this.quillRef) return;
    op.forEach(operation => {
      if (this.quillRef) {
        this.quillRef.getEditor().updateContents(operation.o);
      }
    });
  };

  update = (props: ReactivePropsT) => {
    this.setState({ path: props.path, dataFn: props.dataFn });
    props.dataFn.doc.on('op', this.opListener);
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
    this.props.dataFn.doc.removeListener('op', this.opListener);
  }

  componentWillMount() {
    this.setState({ editorId: uuid()});
  }

  log(msg: string, props?: ReactivePropsT) {
    const logger = props ? props.logger : this.props.logger;
    if (logger && !this.props.dataFn.readOnly) {
      logger({
        type: 'reactivetext.' + msg,
        itemId: JSON.stringify((props || this.props).path),
        value: this.quillRef.getEditor()
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
        <Toolbar editorId={this.state.editorId} hidden={this.props.readOnly}/>
        <ReactQuill
          defaultValue={get(this.props.dataFn.doc.data, `payload.${this.props.path}`)}
          ref={element => { this.quillRef = element }}
          readOnly={this.props.readOnly}
          onChange={this.handleChange}
          modules={modules(this.state.editorId)}
          formats={formats}
        />
      </div>
    );
  }
}