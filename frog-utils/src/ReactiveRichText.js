// @flow
import '@houshuang/react-quill/dist/quill.snow.css';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { shortenRichText, uuid, highlightTargetRichText } from 'frog-utils';
import {
  get,
  isEqual,
  last,
  forEach,
  findIndex,
  head,
  isUndefined,
  filter,
  find
} from 'lodash';
import Paper from '@material-ui/core/Paper';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import FileCopy from '@material-ui/icons/FileCopy';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Create from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';
import ReactQuill, { Quill } from '@houshuang/react-quill';

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
        render={({ children, liType }) => {
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
                    get(LiTypeObject, 'Viewer') &&
                    liView !== LiViewTypes.EDIT && (
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
                  <IconButton
                    disableRipple
                    style={{ float: 'right' }}
                    className={`${classes.button} li-copy-btn`}
                  >
                    <FileCopy />
                  </IconButton>
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
    // Make sure the hover handlers are registered correctly in all collaborating
    // editors for a newly inserted LI
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

    // Emit a delta that represents a 'li-view' formatting of this blot
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

  liCopyHandler = e => {
    // Save existing scroll positions
    const scrollTops = e.path.map(element => get(element, 'scrollTop'));

    const offset = this.offset();
    const index = offset >= 1 ? offset - 1 : 0;
    const length = 2;
    this.parent.emitter.emit(
      'selection-change',
      { index, length },
      undefined,
      Quill.sources.SILENT,
      'li-copy'
    );
    setTimeout(() => {
      document.execCommand('copy');
      this.parent.emitter.emit(
        'selection-change',
        { index: offset, length: 0 },
        undefined,
        Quill.sources.SILENT,
        'li-copy'
      );
      // Restore scroll positions
      e.path.forEach((element, idx) => {
        element.scrollTop = scrollTops[idx];
      });
    }, 1);
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

  // Called every time a blot is rendered to extract the content values
  // Eg: undo LI delete, reload existing document etc.
  static value(node) {
    const child = head(node.childNodes);
    if (child) {
      const liId = get(child.dataset, 'liId');
      const authorId = get(child.dataset, 'authorId');
      const view = get(child.dataset, 'liZoomState');
      return { authorId, liId, view };
    }
    return {};
  }

  refreshClickHandlers = () => {
    const closeButton = this.domNode.querySelector('.li-close-btn');
    const zoomButton = this.domNode.querySelector('.li-zoom-btn');
    const editButton = this.domNode.querySelector('.li-edit-btn');
    const copyButton = this.domNode.querySelector('.li-copy-btn');
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
    if (copyButton) {
      // Remove any existing handlers so that we wont stack them up
      copyButton.removeEventListener('click', this.liCopyHandler);
      copyButton.addEventListener('click', this.liCopyHandler);
    }
  };

  update(mutations, context) {
    // Make sure the handlers are registered for all the LIs in existing content
    // of an editor upon editor load
    this.refreshClickHandlers();
    super.update(mutations, context);
  }

  format(format, value) {
    if (format === 'li-view') {
      // By the time this format() method gets called When an existing blot is
      // rendered on editor load, the 'this.domNode' property used in
      // getLiContent() method is not yet initialized. So this waits a while
      // until it is initialized to run the formatting
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

  // Called when attempted to move cursor into the LI blot using cursor keys.
  // This forcefully places the arrow after the LI to avoid the editor selection
  // going into an 'undefined' index value
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

const Clipboard = Quill.import('modules/clipboard');

class QuillClipboard extends Clipboard {
  // There is a bug in Quill that causes the container scroll to jump on
  // content paste. (Refer https://github.com/quilljs/quill/issues/1082)
  // Following implements a modified version of the workaround suggested by the
  // original author of Quill.
  onPaste(e) {
    const found = find(
      e.path,
      element => element.className === 'ql-learning-item'
    );
    // if found, that means the paste is done inside a LI. So bypass quill processing.
    if (!found) {
      // Save existing scroll positions
      const scrollTops = e.path.map(element => get(element, 'scrollTop'));
      super.onPaste(e);
      setTimeout(() => {
        // Restore scroll positions
        e.path.forEach((element, index) => {
          element.scrollTop = scrollTops[index];
        });
      }, 1);
    }
  }
}

Quill.register('modules/clipboard', QuillClipboard, true);

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

// Bug fix for problem with styles in embedded Hypothesis LIs
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
  'li-view',
  'background'
];

type ReactivePropsT = {
  path: string,
  dataFn: Object,
  data?: Object,
  readOnly?: boolean,
  shorten?: number,
  userId: string,
  search: string
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
      // Ignore if the changes are from our own editor
      return;
    }
    if (this.quillRef) {
      const editor = this.quillRef.getEditor();
      if (!editor) {
        return;
      }

      if (this.props.shorten) {
        // getDocumentContent() returns the latest content of the document shortened
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
          // Ensures the ops are for exactly this editor in situations where there
          // are multiple active editors in the page
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
    let raw = get(
      this.props.data
        ? { payload: this.props.data }
        : this.props.dataFn.doc.data,
      (this.state.path || []).join('.')
    );

    if (this.props.shorten) {
      raw = shortenRichText(raw, this.props.shorten);
    }

    if (this.props.search) {
      raw = highlightTargetRichText(raw, this.props.search);
    }

    return raw;
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

    // Hide author colors if there are no other collaborating users
    if (Object.keys(authorStyleElements).length > 1 && !this.props.readOnly) {
      this.turnAuthorshipOn();
    } else {
      this.turnAuthorshipOff();
    }
  }

  componentDidMount() {
    const editor = this.quillRef.getEditor();
    if (editor) {
      // LI blots in existing content always trigger a change with source 'user'
      // on editor load. This causes the editor to duplicate the LIs in some
      // situations. So registering onChange handler with a delay to avoid
      // processing those initial deltas.
      setTimeout(() => {
        editor.on('text-change', this.handleChange);
        // In case the loaded document had LIs without correct spacing
        this.ensureSpaceAroundLis();

        editor.on('selection-change', this.handleSelectionChange);
      }, 100);

      // When any option is clicked from the quill toolbar from a list, the editor
      // view jumps to top. Following code fixes that.
      const toolbars = document.querySelectorAll('.ql-toolbar');
      toolbars.forEach(toolbar => {
        toolbar.addEventListener('mousedown', event => {
          event.preventDefault();
          event.stopPropagation();
        });
      });
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
      !!(this.props.readOnly || nextProps.readOnly) ||
      this.props.search !== nextProps.search
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
          // The insertText triggers handleChange() and that in turn calls back
          // ensureSpaceAroundLis() until spaces are ensured around all
          // LIs in the document
          if (i === 0 || get(prev, 'statics.blotName') === 'learning-item') {
            editor.insertText(i, '\n', Quill.sources.USER);
            return;
          } else if (get(next, 'statics.blotName') === 'learning-item') {
            editor.insertText(nextIndex, '\n', Quill.sources.USER);
            return;
          } else if (i === editorLength - 1) {
            editor.insertText(i + 1, '\n', Quill.sources.USER);
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

  handleSelectionChange = (
    range: Object,
    previousRange: Object,
    source: string,
    trigger: string
  ) => {
    // This handler gets triggered for all selection changes. We only want to
    // process the event emitted by li copy button.
    if (trigger === 'li-copy') {
      const editor = this.quillRef.getEditor();
      if (editor && range) {
        editor.setSelection(range, Quill.sources.SILENT);
      }
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

        // Add authorship to only inserts
        if (op.insert) {
          op.attributes = op.attributes || {};

          if (
            op.attributes.author &&
            op.attributes.author === this.props.userId
          ) {
            return;
          }

          op.attributes.author = this.props.userId;

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

  onDrop = (e: { item: Object | string }, initialView?: string) => {
    const editor = this.quillRef.getEditor();
    const item = e?.item;

    if (editor && item) {
      // getSelection() method of ReactQuill API returns null since the editor
      // is not focused during drop.
      const index = get(editor, 'selection.savedRange.index');
      const insertPosition = isUndefined(index)
        ? editor.getLength() - 1
        : index;

      const params = {
        liId: JSON.stringify(item),
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
        get(type, 'id') !== 'li-richText' &&
        get(type, 'id') !== 'li-doubleRichText'
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
      <div
        style={{ height: '100%' }}
        onMouseOver={() => {
          if (this.props.dataFn.listore.dragState) {
            this.props.dataFn.listore.setOverCB(this.onDrop);
          }
        }}
        onMouseLeave={() => {
          this.props.dataFn.listore.setOverCB(null);
        }}
      >
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
