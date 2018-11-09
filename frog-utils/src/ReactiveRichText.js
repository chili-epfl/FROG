// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom'
import { get, set, invoke, isEqual, last } from 'lodash';
import ReactQuill, { Quill } from '@houshuang/react-quill';
import { shortenRichText } from './index';

type ReactivePropsT = {
  path: string,
  dataFn: Object,
  data?: Object,
  readOnly?: boolean,
  toolbarOptions?: Object[],
  shorten?: number
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }],
  [{ list: 'ordered' }, { list: 'bullet' }],

  ['link', 'image', 'video']
];

const formats = [
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'code-block',
  'header',
  'list',
  'link',
  'image',
  'video',
  'learning-item'
];

// Some global variable that would set the id to be inserted on blot creation
let learningItemId = "cjo8vmolz00003g6knq01k85s";

const LearningItemContainer = ({dataFn, id}) => (
    <dataFn.LearningItem
      type="edit"
      id={id}
    />
  );

const registerBlot = dataFn => {
  const Embed = Quill.import("blots/block/embed");

  class LearningItemBlot extends Embed {
    static create(value) {
      const node = super.create(value);
      node.setAttribute("contenteditable", false);
      ReactDOM.render(<LearningItemContainer dataFn={dataFn} id={value} />, node);
      return node;
    }
  }

  LearningItemBlot.blotName = 'learning-item';
  LearningItemBlot.tagName = 'div';
  LearningItemBlot.className = 'ql-learning-item';

  Quill.register('formats/learning-item', LearningItemBlot);
};

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
    if (this.quillRef) {
      if (this.props.shorten) {
        this.quillRef.getEditor().setContents(this.getDocumentContent());
      } else {
        op.forEach(operation => {
          const opPath = last(operation.p);
          if (opPath === this.props.path) {
            this.quillRef.getEditor().updateContents(operation.o);
          }
        });
      }
    }
  };

  update = (props: ReactivePropsT) => {
    props.dataFn.doc.on('op', this.opListener);
  };

  getDocumentContent = () => {
    const raw = get(
      this.props.data
        ? { payload: this.props.data }
        : this.props.dataFn.doc.data,
      (this.state.path || []).join('.')
    );
    return this.props.shorten ? shortenRichText(raw, this.props.shorten) : raw;
  };

  componentDidMount() {
    if (!this.props.data) {
      this.update(this.props);
    }
  }

  componentWillMount() {
    this.setState({ path: this.props.dataFn.getMergedPath(this.props.path) });
    registerBlot(this.props.dataFn);
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

  shouldComponentUpdate(nextProps: Object) {
    return (
      this.props.shorten !== nextProps.shorten ||
      !!(this.props.readOnly || nextProps.readOnly)
    );
  }

  componentWillUnmount() {
    if (!this.props.data) {
      this.props.dataFn.doc.removeListener('op', this.opListener);
    }
  }

  handleChange = (contents: string, delta: Object, source: string) => {
    if (!this.props.readOnly) {
      if (source !== 'user') {
        return;
      }
      this.submitOperation(delta);
    }
  };

  submitOperation = delta => {
    const op = {
      p: this.state.path,
      t: 'rich-text',
      o: delta.ops
    };

    this.props.dataFn.doc.submitOp([op], { source: this.quillRef });
  };


  handleClickEmbed = () => {
    const editor = invoke(this.quillRef, 'getEditor');
    if (editor) {
      const range = editor.getSelection();
      if (range) {
        const delta = editor.insertEmbed(range.index, "learning-item", learningItemId);

        // Quill doesn't include the passed value in the delta. So doing it manually
        delta.ops.forEach(op => {
          if(get(op, 'insert.learning-item')) {
            set(op, 'insert.learning-item', learningItemId)
          }
        });
        this.submitOperation(delta);
      }

      // setting a different id for demo purpose so that the second click would
      // add a different li
      learningItemId = "cjo92tost0000rv6wqfndlgub";
    }
  };

  render() {
    const defaultValue = this.getDocumentContent();
    return (
      <div>
        <ReactQuill
          defaultValue={defaultValue}
          ref={element => {
            this.quillRef = element;
          }}
          readOnly={this.props.readOnly}
          onChange={this.handleChange}
          formats={formats}
          modules={{
            toolbar: this.props.readOnly
              ? null
              : this.props.toolbarOptions || toolbarOptions
          }}
        >
          <div style={this.props.readOnly ? { borderStyle: 'hidden' } : {}} />
        </ReactQuill>
        <button onClick={this.handleClickEmbed}>Embed component</button>
      </div>
    );
  }
}
