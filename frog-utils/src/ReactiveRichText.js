// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { get, set, invoke, isEqual, last } from 'lodash';
import ReactQuill, { Quill } from '@houshuang/react-quill';
import { shortenRichText } from './index';

function hashCode(str = '') {
  let hash = 0;
  let i = 0;
  for (; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function pickColor(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}

const Toolbar = ({ id, readOnly }) => (
  <div id={`toolbar-${id}`} style={{display: readOnly ? 'none' : 'block'}}>
    <button className="ql-bold" />
    <button className="ql-italic" />
    <button className="ql-underline" />
    <button className="ql-strike" />

    <button className="ql-blockquote" />
    <button className="ql-code-block" />

    <select className="ql-header" defaultValue="" onChange={e => e.persist()}>
      <option value="1" />
      <option value="2" />
      <option defaultValue />
    </select>

    <button className="ql-list" value="ordered" />
    <button className="ql-list" value="bullet" />

    <button className="ql-link" />
    <button className="ql-image" />
    <button className="ql-video" />

    <button className="ql-toggleAuthorship">
      <AuthorshipToggleBtn />
    </button>
  </div>
);

const AuthorshipToggleBtn = () => <span>AU</span>;

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
  'learning-item',
  'author'
];

const LearningItemContainer = ({ dataFn, id }) => (
  <dataFn.LearningItem type="view" id={id} />
);

const registerBlot = dataFn => {
  const Embed = Quill.import('blots/block/embed');

  class LearningItemBlot extends Embed {
    static create(value) {
      const node = super.create(value);
      const {authorId, liId} = value;
      node.setAttribute('contenteditable', false);
      ReactDOM.render(
        <div className={`ql-author-${authorId}`}><LearningItemContainer dataFn={dataFn} id={liId} /></div>,
        node
      );
      return node;
    }
  }

  LearningItemBlot.blotName = 'learning-item';
  LearningItemBlot.tagName = 'div';
  LearningItemBlot.className = 'ql-learning-item';

  Quill.register('formats/learning-item', LearningItemBlot);
};

const registerAuthorClass = () => {
  const Parchment = Quill.import('parchment');
  const AuthorClass = new Parchment.Attributor.Class('author', 'ql-author', {
    scope: Parchment.Scope.INLINE
  });
  Parchment.register(AuthorClass);
  Quill.register(AuthorClass, true);
};

type ReactivePropsT = {
  path: string,
  dataFn: Object,
  data?: Object,
  readOnly?: boolean,
  shorten?: number,
  userId: string
};

class ReactiveRichText extends Component<
  ReactivePropsT,
  { path: ?((string | number)[]) }
> {
  quillRef: any;
  state = { path: undefined };
  styleElements: {};

  opListener = (op: Object[], source: string) => {
    if (source === this.quillRef) {
      return;
    }
    if (this.quillRef) {
      if (this.props.shorten) {
        this.quillRef.getEditor().setContents(this.getDocumentContent());
      } else {
        op.forEach(operation => {
          console.log(operation)
          operation.o && operation.o.forEach(o => {
            const author = get(o, 'attributes.author');
            if (author) {
              this.addAuthor(author)
            }
          });
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

  initializeAuthorship = () => {
    const editor = this.quillRef.getEditor();
    this.compositionstart = false;
    this.authorDeltaToApply = null;
    editor.scroll.domNode.addEventListener('compositionstart', () => {
      this.compositionstart = true;
      this.authorDeltaToApply = null;
    });
    editor.scroll.domNode.addEventListener('compositionend', () => {
      this.compositionstart = false;
      if (this.authorDeltaToApply) {
        editor.updateContents(this.authorDeltaToApply, Quill.sources.SILENT);
        this.authorDeltaToApply = null;
      }
    });

    this.addAuthor(this.props.userId);
    const content = this.getDocumentContent();
    content.ops && content.ops.forEach(op => {
      const author = get(op, 'attributes.author');
      if (author) {
        this.addAuthor(author);
      }
    })
  };


  toggleAuthorship = () => {
    const editor = invoke(this.quillRef, 'getEditor');
    if (editor) {
      editor.root.classList.toggle('ql-authorship');
    }
  };


  componentDidMount() {
    if (!this.props.data) {
      this.update(this.props);
      this.initializeAuthorship();
      if (!this.props.readOnly) {
        this.toggleAuthorship();
      }
    }
  }

  componentWillMount() {
    this.setState({ path: this.props.dataFn.getMergedPath(this.props.path) });
    registerBlot(this.props.dataFn);
    registerAuthorClass();
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

  addAuthor(id) {
    if (!id) {
      return;
    }
    const color = pickColor(id);
    const css =
      '.ql-authorship .ql-author-' +
      id +
      ' { ' +
      'background-color:' +
      color +
      '; }\n';

    const styleElements = this.styleElements || {};
    if (!get(styleElements, id)) {
      styleElements[id] = document.createElement('style');
      styleElements[id].type = 'text/css';
      styleElements[id].classList.add('ql-authorship-style'); // in case for some manipulation
      styleElements[id].classList.add(
        'ql-authorship-style-' + id
      ); // in case for some manipulation
      styleElements[id].innerHTML = css;
      document.documentElement
        .getElementsByTagName('head')[0]
        .appendChild(styleElements[id]);

    }
    this.styleElements = styleElements;
  }


  handleChange = (contents: string, delta: Object, source: string) => {
    if (!this.props.readOnly) {
      if (source !== 'user') {
        return;
      }
      console.log('processing ', delta)

      const editor = this.quillRef.getEditor();

      const Delta = Quill.import('delta');

      const authorDelta = new Delta();
      const authorFormat = { author: this.props.userId };

      delta.ops.forEach(op => {
        if (op.delete) {
          return;
        }
        // if (op.insert || (op.retain && op.attributes)) {
        if (op.insert) {
          // Add authorship to only inserts
          op.attributes = op.attributes || {};

          // Bug fix for Chinese keyboards which show Pinyin first before Chinese text, and also other keyboards like Tamil
          if (
            op.attributes.author &&
            op.attributes.author === this.props.userId
          ) {
            return;
          }
          // End bug fix

          op.attributes.author = this.props.userId;
          // Apply authorship to our own editor
          authorDelta.retain(
            op.retain || op.insert.length || 1,
            authorFormat
          );
        } else {
          authorDelta.retain(op.retain);
        }
      });

      // if IME keyboard (e.g. CH Pinyin), only update the delta with author attribute
      // on `compositionend`. If non-IME keyboard (e.g. English) there will be no `compositionstart`
      this.authorDeltaToApply = authorDelta; // copy it to apply later at `conpositionend` for IME keyboards
      if (!this.compositionstart) {
        // if non-IME keyboards, else wait for the `compositionend` to fire (see above)
        editor.updateContents(authorDelta, Quill.sources.SILENT);
      }
      console.log('submitting ', delta)
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

  onDrop = e => {
    const editor = invoke(this.quillRef, 'getEditor');
    if (editor) {
      const range = editor.getSelection() || 0;
      const params = {
        liId: e,
        authorId: this.props.userId
      };
      const delta = editor.insertEmbed(range.index, 'learning-item', params);

      // Quill doesn't include the passed value in the delta. So doing it manually
      delta.ops.forEach(op => {
        if (get(op, 'insert.learning-item')) {
          set(op, 'insert.learning-item', params);
        }
      });
      this.submitOperation(delta);
    }
  };

  render() {
    const defaultValue = this.getDocumentContent();
    return (
      <div>
        <Toolbar id={`${this.props.userId}-${this.props.path}`} readOnly={this.props.readOnly}/>
        <ReactQuill
          defaultValue={defaultValue}
          ref={element => {
            this.quillRef = element;
          }}
          readOnly={this.props.readOnly}
          onChange={this.handleChange}
          formats={formats}
          modules={{
            toolbar: {
                container: `#toolbar-${this.props.userId}-${this.props.path}`,
                handlers: {
                  "toggleAuthorship": this.toggleAuthorship
                }
              }
          }}
        >
          <div style={this.props.readOnly ? { borderStyle: 'hidden' } : {}} />
        </ReactQuill>
      </div>
    );
  }
}

window.q = Quill;
export default ReactiveRichText;