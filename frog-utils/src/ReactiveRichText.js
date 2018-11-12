// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { get, set, invoke, isEqual, last } from 'lodash';
import ReactQuill, { Quill } from '@houshuang/react-quill';
import { shortenRichText } from './index';

function hashCode(str = '') {
  let hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return hash;
}

function pickColor(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 80%)`;
}

class Authorship {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.isEnabled;

    if (this.options.enabled) {
      this.enable();
      this.isEnabled = true;
    }
    if (!this.options.authorId) {
      return;
    }
    const Delta = Quill.import('delta');

    // For IME keyboards detection. If IME keyboards, only add author attribute
    // on `compositionend` where actual character appears (like in Chinese Pinyin keyboards)
    let compositionstart = false;
    let authorDeltaToApply = null;
    this.quill.scroll.domNode.addEventListener('compositionstart', function() {
      compositionstart = true;
      authorDeltaToApply = null;
    });
    this.quill.scroll.domNode.addEventListener('compositionend', function() {
      compositionstart = false;
      if (authorDeltaToApply) {
        quill.updateContents(authorDeltaToApply, Quill.sources.SILENT);
        authorDeltaToApply = null;
      }
    });

    this.quill.on(
      Quill.events.EDITOR_CHANGE,
      (eventName, delta, oldDelta, source) => {
        console.log('author on', eventName, delta, oldDelta, source)
        if (eventName === Quill.events.TEXT_CHANGE && source === 'user') {
          const authorDelta = new Delta();
          const authorFormat = { author: this.options.authorId }; // bug is here how to apply Attributor class to delta?

          delta.ops.forEach(op => {
            if (op.delete) {
              return;
            }
            if (op.insert || (op.retain && op.attributes)) {
              // Add authorship to insert/format
              op.attributes = op.attributes || {};

              // Bug fix for Chinese keyboards which show Pinyin first before Chinese text, and also other keyboards like Tamil
              if (
                op.attributes.author &&
                op.attributes.author === this.options.authorId
              ) {
                return;
              }
              // End bug fix
              op.attributes.author = this.options.authorId;
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
          authorDeltaToApply = authorDelta; // copy it to apply later at `conpositionend` for IME keyboards
          if (!compositionstart) {
            // if non-IME keyboards, else wait for the `compositionend` to fire (see above)
            console.log('updating contents')
            this.quill.updateContents(authorDelta, 'custom-source');
          }
        }
      }
    );
    this.addAuthor(this.options.authorId, this.options.color);

    // for authorship color on/off toolbar item
    // let toolbar = this.quill.getModule('toolbar');
    // if (toolbar) {
    //   toolbar.addHandler('authorship-toggle', function() {});
    //   let customButton = document.querySelector('button.ql-authorship-toggle');
    //
    //   let authorshipObj = this;
    //   customButton.addEventListener('click', function() {
    //     // toggle on/off authorship colors
    //     authorshipObj.enable(!authorshipObj.isEnabled);
    //   });
    // }

    // // to delete the other author background style.
    quill.clipboard.addMatcher('span', function(node, delta) {
      delta.ops.forEach(function(op) {
        op.attributes['background'] && delete op.attributes['background'];
      });
      return delta;
    });
  }

  enable(enabled = true) {
    this.quill.root.classList.toggle('ql-authorship', enabled);
    this.isEnabled = enabled;
  }

  disable() {
    this.enable(false);
    this.isEnabled = false;
  }

  addAuthor(id, color) {
    let css =
      '.ql-authorship .ql-author-' +
      id +
      ' { ' +
      'background-color:' +
      color +
      '; }\n';
    this.addStyle(css);
  }

  addStyle(css) {
    if (!this.styleElement) {
      this.styleElement = document.createElement('style');
      this.styleElement.type = 'text/css';
      this.styleElement.classList.add('ql-authorship-style'); // in case for some manipulation
      this.styleElement.classList.add(
        'ql-authorship-style-' + this.options.authorId
      ); // in case for some manipulation
      document.documentElement
        .getElementsByTagName('head')[0]
        .appendChild(this.styleElement);
    }

    this.styleElement.innerHTML = css; // bug fix
    // this.styleElement.sheet.insertRule(css, 0);
  }
}

Authorship.DEFAULTS = {
  authorId: null,
  color: 'transparent',
  enabled: false
};

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  ['authorship-toggle'],
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
      node.setAttribute('contenteditable', false);
      ReactDOM.render(
        <LearningItemContainer dataFn={dataFn} id={value} />,
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

type ReactivePropsT = {
  path: string,
  dataFn: Object,
  data?: Object,
  readOnly?: boolean,
  toolbarOptions?: Object[],
  shorten?: number,
  userId: string
};

class ReactiveRichText extends Component<
  ReactivePropsT,
  { path: ?((string | number)[]) }
> {
  quillRef: any;
  state = { path: undefined };

  opListener = (op: Object[], source: string) => {
    console.log('received op', op)
    console.log(source, this.quillRef)
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
            console.log('editor update contents')
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
    const Parchment = Quill.import('parchment');
    const AuthorClass = new Parchment.Attributor.Class('author', 'ql-author', {
      scope: Parchment.Scope.INLINE
    });
    Parchment.register(AuthorClass);
    Quill.register(AuthorClass, true);
    Quill.register('modules/authorship', Authorship);
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
      console.log('inhandle change. source ', source);
      if (source !== 'custom-source' && source !== 'user') {
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

  onDrop = e => {
    // console.log(e);
    const editor = invoke(this.quillRef, 'getEditor');
    // console.log(editor);
    if (editor) {
      const range = editor.getSelection() || 0;
      // console.log(range);
      const delta = editor.insertEmbed(range.index, 'learning-item', e);

      // Quill doesn't include the passed value in the delta. So doing it manually
      delta.ops.forEach(op => {
        if (get(op, 'insert.learning-item')) {
          set(op, 'insert.learning-item', e);
        }
      });
      this.submitOperation(delta);
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
              : this.props.toolbarOptions || toolbarOptions,
            authorship: {
              enabled: true,
              authorId: this.props.userId,
              color: pickColor(this.props.userId)
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
