// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { get, invoke, isEqual, last, forEach, findIndex, head, isUndefined } from 'lodash';
import Paper from '@material-ui/core/Paper';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Create from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import ReactQuill, { Quill } from '@houshuang/react-quill';
import { shortenRichText, uuid } from './index';

const LiTypes = {
  VIEW: 'view',
  THUMB: 'thumbView',
  EDIT: 'edit'
};

const Delta = Quill.import('delta');

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  },
  button: {
    color: '#AA0000',
    width: 36,
    height: 36,
  },
});

let reactiveRichTextDataFn;

class LIComponentRaw extends Component {
  state = { type: this.props.type };

  handleZoomClick = () => {
    this.setState({ type: this.state.type === LiTypes.VIEW? LiTypes.THUMB: LiTypes.VIEW })
  };

  handleEditClick = () => {
    this.setState({ type: this.state.type === LiTypes.EDIT? LiTypes.THUMB: LiTypes.EDIT })
  };

  render() {
    const { id, authorId, classes } = this.props;
    const LearningItem = reactiveRichTextDataFn.LearningItem;
    return (
      <div>
        <LearningItem
          type={this.state.type}
          id={id}
          render={({ children }) => (
            <>
              <Paper className={classes.root} elevation={10} square onMouseEnter={this.handlePopoverOpen}
                     onMouseLeave={this.handlePopoverClose}>
                <div>
                  <IconButton disableRipple className={`${classes.button} li-close-btn`}>
                    <Close />
                  </IconButton>
                  <IconButton disableRipple style={{float: 'right'}}
                              className={classes.button} onClick={this.handleEditClick}>
                    {this.state.type === LiTypes.EDIT ? <Save /> : <Create />}
                  </IconButton>
                  <IconButton disableRipple style={{float: 'right'}}
                              className={classes.button} onClick={this.handleZoomClick}>
                    {this.state.type !== LiTypes.VIEW ? <ZoomIn />: <ZoomOut />}
                  </IconButton>
                </div>
                {children}
              </Paper>
            </>
          )}
        />
        <div className={`ql-author-${authorId}`} style={{ height: '3px' }} />
      </div>
    );
  }
}

const LIComponent = withStyles(styles)(LIComponentRaw);

const Embed = Quill.import('blots/block/embed');
class LearningItemBlot extends Embed {
  static create(value) {
    const node = super.create(value);
    const { authorId, liId, type } = value;

    node.setAttribute('contenteditable', false);
    ReactDOM.render(
      <div data-liid={liId} data-authorid={authorId} data-litype={type}>
        <LIComponent id={JSON.parse(liId)} authorId={authorId} type={type}/>
      </div>,
      node
    );
    return node;
  }

  liCloseHandler = () => {
    this.domNode.parentNode.removeChild(this.domNode);
    this.detach();
  };

  static value(node) {
    const child = head(node.childNodes);
    if (child) {
      const liId = get(child.dataset, 'liid');
      const authorId = get(child.dataset, 'authorid');
      const type = get(child.dataset, 'litype');
      return { authorId, liId, type };
    }
    return {};
  }

  update(mutations, context) {
    const closeButton = this.domNode.querySelector('.li-close-btn');
    if (closeButton) {
      // Remove any existing handlers so that we wont stack them up
      closeButton.removeEventListener("click", this.liCloseHandler);
      closeButton.addEventListener("click", this.liCloseHandler);
    }

    super.update(mutations, context)
  }

  static length() {
    return 1;
  }

  position() {
    const allBlots = get(this.parent, 'domNode.childNodes');
    const thisIndex = [].indexOf.call(allBlots, this.domNode);
    const offset = findIndex(
      allBlots,
      blot => blot.className !== 'ql-learning-item',
      thisIndex
    );
    return [this.parent.domNode, offset >= 0 ? offset : allBlots.length - 1];
  }
}

LearningItemBlot.blotName = 'learning-item';
LearningItemBlot.tagName = 'div';
LearningItemBlot.className = 'ql-learning-item';

Quill.register('formats/learning-item', LearningItemBlot);

const Parchment = Quill.import('parchment');
const AuthorClass = new Parchment.Attributor.Class('author', 'ql-author', {
  scope: Parchment.Scope.INLINE
});
Parchment.register(AuthorClass);
Quill.register(AuthorClass, true);

function hashCode(str = '') {
  let hash = 0;
  let i = 0;
  for (; i < str.length; i += 1) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash); // eslint-disable-line no-bitwise
  }
  return hash;
}

function pickColor(str) {
  return `hsl(${hashCode(str) % 360}, 100%, 30%)`;
}

const Toolbar = ({ id, readOnly }) => (
  <div id={`toolbar-${id}`} style={{ display: readOnly ? 'none' : 'block' }}>
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

const authorStyleElements = {};

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
  compositionStart: boolean;
  authorDeltaToApply: any;
  toolbarId: string = uuid();
  styleElements: {};
  state = { path: this.props.dataFn.getMergedPath(this.props.path) };

  constructor(props) {
    super(props);
    reactiveRichTextDataFn = props.dataFn;
  }

  opListener = (op: Object[], source: string) => {
    if (source === this.quillRef) {
      return;
    }
    if (this.quillRef) {
      const editor = this.quillRef?.getEditor();
      if (!editor) {
        return
      }

      if (this.props.shorten) {
        editor.setContents(this.getDocumentContent());
      } else {
        forEach(op, operation => {
          const operations = get(operation, 'o.ops') || get(operation, 'o');
          forEach(operations, o => {
            const author = get(o, 'attributes.author');
            if (author) {
              this.addAuthor(author);
            }
          });
          const opPath = last(operation.p);
          if (opPath === this.props.path) {
            editor.updateContents(operation.o);
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

  compositionStartHandler = () => {
    this.compositionStart = true;
    this.authorDeltaToApply = null;
  };

  compositionEndHandler = editor => () => {
    this.compositionStart = false;
    if (this.authorDeltaToApply) {
      editor.updateContents(this.authorDeltaToApply, Quill.sources.SILENT);
      this.authorDeltaToApply = null;
    }
  };

  initializeAuthorship = () => {
    this.compositionStart = false;
    this.authorDeltaToApply = null;

    const editor = this.quillRef?.getEditor();
    if (editor) {
      editor.scroll.domNode.addEventListener(
        'compositionstart',
        this.compositionStartHandler
      );
      editor.scroll.domNode.addEventListener(
        'compositionend',
        this.compositionEndHandler(editor)
      );
    }

    this.addAuthor(this.props.userId);
    const content = this.getDocumentContent();
    forEach(content.ops, op => {
      const author = get(op, 'attributes.author');
      if (author) {
        this.addAuthor(author);
      }
    });
  };

  toggleAuthorship = () => {
    const editor = invoke(this.quillRef, 'getEditor');
    if (editor) {
      editor.root.classList.toggle('ql-authorship');
    }
  };

  componentDidMount() {
    const editor = invoke(this.quillRef, 'getEditor');
    if (editor) {
      setTimeout(() => {
        editor.on('text-change', this.handleChange);
      }, 100);
    }

    if (!this.props.data) {
      this.update(this.props);
      this.initializeAuthorship();
      if (!this.props.readOnly) {
        this.toggleAuthorship();
      }
    }
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
      const editor = this.quillRef?.getEditor();
      if (editor) {
        editor.scroll.domNode.removeEventListener(
          'compositionstart',
          this.compositionStartHandler
        );
        editor.scroll.domNode.removeEventListener(
          'compositionend',
          this.compositionEndHandler(editor)
        );
      }
    }
  }

  addAuthor(id: string) {
    if (!id) {
      return;
    }
    const color = pickColor(id);
    const css = `.ql-authorship .ql-author-${id} { color: ${color}; }
    .ql-authorship div.ql-author-${id} {background-color: ${color}}`;

    if (!get(authorStyleElements, id)) {
      authorStyleElements[id] = document.createElement('style');
      authorStyleElements[id].type = 'text/css';
      authorStyleElements[id].classList.add('ql-authorship-style');
      authorStyleElements[id].classList.add(`ql-authorship-style-${id}`);
      authorStyleElements[id].innerHTML = css;
      document.documentElement // $FlowFixMe
        .getElementsByTagName('head')[0]
        .appendChild(authorStyleElements[id]);
    }
  }

  handleChange = (delta: Object, oldContents: Object, source: string) => {
    if (!this.props.readOnly) {
      if (source !== 'user') {
        return;
      }

      this.submitOperation(delta);
    }
  };

  submitOperation = (delta: { ops: Array<{}> }) => {
    const editor = this.quillRef?.getEditor();

    if (editor) {
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
          authorDelta.retain(op.retain || op.insert.length || 1, authorFormat);
        } else {
          authorDelta.retain(op.retain);
        }
      });

      // if IME keyboard (e.g. CH Pinyin), only update the delta with author attribute
      // on `compositionend`. If non-IME keyboard (e.g. English) there will be no `compositionStart`
      this.authorDeltaToApply = authorDelta; // copy it to apply later at `conpositionend` for IME keyboards
      if (!this.compositionStart) {
        // if non-IME keyboards, else wait for the `compositionend` to fire (see above)
        editor.updateContents(authorDelta, Quill.sources.SILENT);
      }
    }

    const op = {
      p: this.state.path,
      t: 'rich-text',
      o: delta.ops
    };

    this.props.dataFn.doc.submitOp([op], { source: this.quillRef });
  };

  onDrop = (e: string) => {
    const editor = invoke(this.quillRef, 'getEditor');

    if (editor) {
      const index = get(editor, 'selection.savedRange.index');
      let insertPosition = isUndefined(index) ? editor.getLength() - 1 : index;

      const params = {
        liId: JSON.stringify(e),
        authorId: this.props.userId,
        type: LiTypes.VIEW
      };

      const prevPosition = Math.max(0, insertPosition - 1);
      if (index === 0 || editor.getText(prevPosition, 1) !== '\n') {
        editor.insertText(insertPosition, '\n', Quill.sources.USER);
        insertPosition += 1;
      }

      editor.insertEmbed(
        insertPosition,
        'learning-item',
        params,
        Quill.sources.USER
      );

      editor.insertText(insertPosition + 1, '\n', Quill.sources.USER);
      editor.setSelection(insertPosition + 2, 0 , Quill.sources.USER);
    }
  };

  render() {
    const defaultValue = this.getDocumentContent();
    const props = this.props;
    const scrollContainerClass = 'scroll-container';
    const editorStyle = props.readOnly
      ? { borderStyle: 'hidden' }
      : {
          maxHeight: '250px',
          minHeight: '100%',
          overflowY: 'auto'
        };
    return (
      <div>
        {!get(props, 'readOnly') && (
          <Toolbar id={this.toolbarId} readOnly={get(props, 'readOnly')} />
        )}
        <ReactQuill
          defaultValue={defaultValue}
          ref={element => {
            this.quillRef = element;
          }}
          readOnly={get(props, 'readOnly')}
          formats={formats}
          modules={{
            toolbar: get(props, 'readOnly')
              ? null
              : {
                  container: `#toolbar-${this.toolbarId}`,
                  handlers: {
                    toggleAuthorship: this.toggleAuthorship
                  }
                }
          }}
          scrollingContainer={`.${scrollContainerClass}`}
        >
          <div className={scrollContainerClass} style={editorStyle} />
        </ReactQuill>
      </div>
    );
  }
}

window.q = Quill;
export default ReactiveRichText;
