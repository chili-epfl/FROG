// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  get,
  isEqual,
  last,
  forEach,
  findIndex,
  head,
  isUndefined,
  filter
} from 'lodash';
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

const Delta = Quill.import('delta');

const LiViewTypes = {
  VIEW: 'view',
  THUMB: 'thumbView',
  EDIT: 'edit'
};

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    overflow: 'auto'
  },
  button: {
    color: '#AA0000',
    width: 36,
    height: 36
  },
  liTools: {
    visibility: 'hidden'
  },
  liContainer: {
    '&:hover $liTools': {
      visibility: 'visible'
    }
  }
});

let reactiveRichTextDataFn;

const LIComponentRaw = ({ id, authorId, classes, liView, liZoomState }) => {
  const LearningItem = reactiveRichTextDataFn.LearningItem;
  return (
    <div>
      <LearningItem
        type={liView}
        id={id}
        render={({ children, liType, dataFn }) => {
          const learningTypesObj = reactiveRichTextDataFn.getLearningTypesObj();
          const LiTypeObject = get(learningTypesObj, liType);
          return (
            <div className={classes.liContainer}>
              <Paper className={classes.root} elevation={10} square>
                <div className={classes.liTools}>
                  {/* Button click handlers are attached dynamically in LearningItemBlot since they require access */}
                  {/* to blot instance information, but the LIComponentRaw initialization is done by a static method */}
                  <IconButton
                    disableRipple
                    className={`${classes.button} li-close-btn`}
                  >
                    <Close />
                  </IconButton>
                  {liType !== 'li-richText' && get(LiTypeObject, 'Editor') && (
                    <IconButton
                      disableRipple
                      style={{ float: 'right' }}
                      className={`${classes.button} li-edit-btn`}
                    >
                      {liView === LiViewTypes.EDIT ? <Save /> : <Create />}
                    </IconButton>
                  )}
                  {get(LiTypeObject, 'ThumbViewer') &&
                    get(LiTypeObject, 'Viewer') && (
                      <IconButton
                        disableRipple
                        style={{ float: 'right' }}
                        className={`${classes.button} li-zoom-btn`}
                      >
                        {liZoomState === LiViewTypes.THUMB ? (
                          <ZoomIn />
                        ) : (
                          <ZoomOut />
                        )}
                      </IconButton>
                    )}
                </div>
                {children}
              </Paper>
            </div>
          );
        }}
      />
      <div className={`ql-author-${authorId}`} style={{ height: '3px' }} />
    </div>
  );
};

const LIComponent = withStyles(styles)(LIComponentRaw);

const Embed = Quill.import('blots/block/embed');
class LearningItemBlot extends Embed {
  static create(value) {
    const node = super.create(value);
    const { authorId, liId, view } = value;
    const initialView = view || LiViewTypes.VIEW;

    node.setAttribute('contenteditable', false);
    LearningItemBlot.renderLItoNode(
      liId,
      authorId,
      initialView,
      initialView === LiViewTypes.EDIT ? LiViewTypes.VIEW : initialView,
      node
    );
    return node;
  }

  static renderLItoNode(liId, authorId, liView, zoomState, node) {
    ReactDOM.render(
      <div
        data-li-id={liId}
        data-author-id={authorId}
        data-li-view={liView}
        data-li-zoom-state={zoomState}
      >
        <LIComponent
          id={JSON.parse(liId)}
          authorId={authorId}
          liView={liView}
          liZoomState={zoomState}
        />
      </div>,
      node
    );
  }

  constructor(domNode, value) {
    super(domNode, value);
    this.refreshClickHandlers();
  }

  liCloseHandler = () => {
    this.domNode.parentNode.removeChild(this.domNode);
    this.detach();
  };

  liZoomHandler = () => {
    const { zoomState: currentZoomState } = this.getLiContent();
    const nextZoomState =
      currentZoomState === LiViewTypes.VIEW
        ? LiViewTypes.THUMB
        : LiViewTypes.VIEW;

    const offset = this.offset();
    const delta = new Delta();
    delta.retain(offset);
    delta.retain(1, { 'li-view': nextZoomState });
    this.parent.emitter.emit('text-change', delta, undefined, 'user');
  };

  liEditHandler = () => {
    const { liView: currentView, zoomState } = this.getLiContent();
    const nextView =
      currentView === LiViewTypes.EDIT ? zoomState : LiViewTypes.EDIT;

    this.format('li-view', nextView);
  };

  getLiContent = () => {
    const child = head(this.domNode.childNodes);
    if (child) {
      const liId = get(child.dataset, 'liId');
      const authorId = get(child.dataset, 'authorId');
      const liView = get(child.dataset, 'liView');
      const zoomState = get(child.dataset, 'liZoomState');
      return { authorId, liId, liView, zoomState };
    }
    return {};
  };

  static value(node) {
    const child = head(node.childNodes);
    if (child) {
      const liId = get(child.dataset, 'liId');
      const authorId = get(child.dataset, 'authorId');
      return { authorId, liId };
    }
    return {};
  }

  refreshClickHandlers = () => {
    const closeButton = this.domNode.querySelector('.li-close-btn');
    const zoomButton = this.domNode.querySelector('.li-zoom-btn');
    const editButton = this.domNode.querySelector('.li-edit-btn');
    if (closeButton) {
      // Remove any existing handlers so that we wont stack them up
      closeButton.removeEventListener('click', this.liCloseHandler);
      closeButton.addEventListener('click', this.liCloseHandler);
    }
    if (zoomButton) {
      // Remove any existing handlers so that we wont stack them up
      zoomButton.removeEventListener('click', this.liZoomHandler);
      zoomButton.addEventListener('click', this.liZoomHandler);
    }
    if (editButton) {
      // Remove any existing handlers so that we wont stack them up
      editButton.removeEventListener('click', this.liEditHandler);
      editButton.addEventListener('click', this.liEditHandler);
    }
  };

  update(mutations, context) {
    this.refreshClickHandlers();
    super.update(mutations, context);
  }

  format(format, value) {
    if (format === 'li-view') {
      setTimeout(() => {
        const { liId, authorId, zoomState } = this.getLiContent();
        if (liId && authorId && value) {
          LearningItemBlot.renderLItoNode(
            liId,
            authorId,
            value,
            value === LiViewTypes.EDIT ? zoomState : value,
            this.domNode
          );
          this.refreshClickHandlers();
        }
      }, 100);
    } else {
      super.format(format, value);
    }
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

const LiViewAttribute = new Parchment.Attributor.Attribute(
  'li-view',
  'li-view'
);
Parchment.register(LiViewAttribute);
Quill.register(LiViewAttribute, true);

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

const Toolbar = ({ id, readOnly, liTypes }) => (
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
    <select className="ql-insertLi" onChange={e => e.persist()}>
      <option value="">Select type...</option>
      {liTypes.map(type => (
        <option key={`${type.id}-${id}`} value={type.id}>
          {type.name}
        </option>
      ))}
    </select>
  </div>
);

const AuthorshipToggleBtn = () => <span>AU</span>;

const authorStyleElements = {};

// Add styles for LI+ button in toolbar
const menuItemStyle = document.createElement('style');
menuItemStyle.type = 'text/css';
menuItemStyle.innerHTML = `.ql-insertLi .ql-picker-item:before { content: attr(data-label); }
      .ql-insertLi .ql-picker-label:before { content: 'LI+'; padding-right: 12px; }`;
document.documentElement // $FlowFixMe
  .getElementsByTagName('head')[0]
  .appendChild(menuItemStyle);

const hypothesisStyleFix = document.createElement('style');
hypothesisStyleFix.type = 'text/css';
hypothesisStyleFix.innerHTML = `.ql-editor annotation-viewer-content li::before { content: none; }`;
document.documentElement // $FlowFixMe
  .getElementsByTagName('head')[0]
  .appendChild(hypothesisStyleFix);

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
  'author',
  'li-view'
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

  constructor(props: ReactivePropsT) {
    super(props);
    reactiveRichTextDataFn = props.dataFn;
  }

  opListener = (op: Object[], source: string) => {
    if (source === this.quillRef) {
      return;
    }
    if (this.quillRef) {
      const editor = this.quillRef.getEditor();
      if (!editor) {
        return;
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

  compositionEndHandler = (editor: Object) => () => {
    this.compositionStart = false;
    if (this.authorDeltaToApply) {
      editor.updateContents(this.authorDeltaToApply, Quill.sources.SILENT);
      this.authorDeltaToApply = null;
    }
  };

  initializeAuthorship = () => {
    this.compositionStart = false;
    this.authorDeltaToApply = null;

    const editor = this.quillRef.getEditor();
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

  turnAuthorshipOn = () => {
    const editor = this.quillRef.getEditor();
    if (editor && !editor.root.classList.contains('ql-authorship')) {
      editor.root.classList.add('ql-authorship');
    }
  };

  turnAuthorshipOff = () => {
    const editor = this.quillRef.getEditor();
    if (editor && editor.root.classList.contains('ql-authorship')) {
      editor.root.classList.remove('ql-authorship');
    }
  };

  toggleAuthorship = () => {
    const editor = this.quillRef.getEditor();
    if (editor) {
      editor.root.classList.toggle('ql-authorship');
    }
  };

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

    if (Object.keys(authorStyleElements).length > 1 && !this.props.readOnly) {
      this.turnAuthorshipOn();
    } else {
      this.turnAuthorshipOff();
    }
  }

  componentDidMount() {
    const editor = this.quillRef.getEditor();
    if (editor) {
      setTimeout(() => {
        editor.on('text-change', this.handleChange);
      }, 100);
    }

    if (!this.props.data) {
      this.update(this.props);
      this.initializeAuthorship();
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
      const editor = this.quillRef.getEditor();
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

  ensureSpaceAroundLis = () => {
    const editor = this.quillRef.getEditor();
    if (editor) {
      const editorLength = editor.getLength();

      for (let i = 0; i < editorLength; i += 1) {
        const [blot] = editor.getLeaf(i);
        const blotName = get(blot, 'statics.blotName');

        if (blotName === 'learning-item') {
          const prevIndex = Math.max(i - 1, 0);
          const nextIndex = Math.min(i + 1, editor.getLength());
          const [prev] = editor.getLeaf(prevIndex);
          const [next] = editor.getLeaf(nextIndex);
          if (i === 0 || get(prev, 'statics.blotName') === 'learning-item') {
            editor.insertText(i, '\n', Quill.sources.USER);
            return;
          } else if (next.statics.blotName === 'learning-item') {
            editor.insertText(nextIndex, '\n', Quill.sources.USER);
            return;
          }
        }
      }
    }
  };

  handleChange = (delta: Object, oldContents: Object, source: string) => {
    if (!this.props.readOnly) {
      if (source !== 'user') {
        return;
      }
      this.submitOperation(delta);
      this.ensureSpaceAroundLis();
    }
  };

  submitOperation = (delta: {
    ops: Array<{
      delete: number,
      insert: Object | string,
      retain: number,
      attributes: { author?: string, 'li-view'?: string }
    }>
  }) => {
    const editor = this.quillRef.getEditor();

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
          const liView = get(op, 'attributes.li-view');
          if (liView) {
            authorDelta.retain(op.retain, op.attributes);
          } else {
            authorDelta.retain(op.retain);
          }
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

  onDrop = (e: string, initialView?: string) => {
    const editor = this.quillRef.getEditor();

    if (editor) {
      const index = get(editor, 'selection.savedRange.index');
      const insertPosition = isUndefined(index)
        ? editor.getLength() - 1
        : index;

      const params = {
        liId: JSON.stringify(e),
        authorId: this.props.userId,
        view: initialView
      };

      editor.insertEmbed(
        insertPosition,
        'learning-item',
        params,
        Quill.sources.USER
      );

      editor.setSelection(insertPosition + 1, 0, Quill.sources.USER);
    }
  };

  insertNewLi = (type: string) => {
    if (type) {
      const newLiId = this.props.dataFn.createLearningItem(type);
      this.onDrop(newLiId, LiViewTypes.EDIT);
    }
  };

  getLiTypeList = () => {
    const allLiTypes = this.props.dataFn.getLearningTypesObj();
    return filter(
      allLiTypes,
      type =>
        get(type, 'dataStructure') &&
        get(type, 'Editor') &&
        get(type, 'id') !== 'li-richText'
    );
  };

  render() {
    const defaultValue = this.getDocumentContent();
    const props = this.props;
    const scrollContainerClass = 'scroll-container';
    const editorStyle = props.readOnly
      ? { borderStyle: 'hidden' }
      : {
          overflowY: 'auto',
          height: '100%'
        };
    return (
      <div style={{ height: '100%' }}>
        {!get(props, 'readOnly') && (
          <Toolbar
            id={this.toolbarId}
            readOnly={get(props, 'readOnly')}
            liTypes={this.getLiTypeList()}
          />
        )}
        <ReactQuill
          defaultValue={defaultValue}
          ref={element => {
            this.quillRef = element;
          }}
          readOnly={get(props, 'readOnly')}
          formats={formats}
          style={{ height: '90%' }}
          modules={{
            toolbar: get(props, 'readOnly')
              ? null
              : {
                  container: `#toolbar-${this.toolbarId}`,
                  handlers: {
                    toggleAuthorship: this.toggleAuthorship,
                    insertLi: this.insertNewLi
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
