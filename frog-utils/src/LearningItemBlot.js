import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {
  HighlightSearchText,
  uuid,
  highlightTargetRichText,
  cloneDeep
} from 'frog-utils';
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

const Embed = Quill.import('blots/block/embed');

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

const LIComponentRaw = ({
  id,
  authorId,
  classes,
  liView,
  liZoomState,
  controls
}) => {
  const learningTypesObj = window.reactiveRichTextDataFn.getLearningTypesObj();
  console.log(learningTypesObj);
  const LearningItem = window.reactiveRichTextDataFn.LearningItem;
  console.log(LearningItem);
  const controlsStyle = controls ? {} : { visibility: 'hidden' };
  return (
    <div>
      <LearningItem
        type={liView}
        id={id}
        render={({ children, liType }) => {
          const LiTypeObject = get(learningTypesObj, liType);
          return (
            <div className={classes.liContainer}>
              <Paper className={classes.root} elevation={10} square>
                <div className={classes.liTools} style={controlsStyle}>
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


class LearningItemBlot extends Embed {
  static create(value) {
    console.log(value);
    const node = super.create(value);
    const { authorId, liId, view, LearningItem } = value;
    const initialView = view || LiViewTypes.VIEW;

    node.setAttribute('contenteditable', false);
    LearningItemBlot.renderLItoNode(
      liId,
      authorId,
      initialView,
      initialView === LiViewTypes.EDIT ? LiViewTypes.VIEW : initialView,
      true,
      LearningItem,
      node
    );
    return node;
  }

  static renderLItoNode(liId, authorId, liView, zoomState, controls, LearningItem, node) {
    ReactDOM.render(
      <div
        data-li-id={liId}
        data-author-id={authorId}
        data-li-view={liView}
        data-li-zoom-state={zoomState}
        data-li-controls={controls}
      >
        <LIComponent
          id={JSON.parse(liId)}
          authorId={authorId}
          liView={liView}
          liZoomState={zoomState}
          controls={controls}
          LearningItem={LearningItem}
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
      const controlsVisibility = get(child.dataset, 'liControls');
      return { authorId, liId, liView, zoomState, controlsVisibility };
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
    const quill = Quill.find(this.domNode.parentNode.parentElement);
    if (quill.options.readOnly) {
      setTimeout(() => {
        const { liId, authorId, liView, zoomState } = this.getLiContent();
        if (liId && authorId && zoomState && liView) {
          LearningItemBlot.renderLItoNode(
            liId,
            authorId,
            liView,
            zoomState,
            false,
            this.domNode
          );
        }
      }, 100);
      return;
    }

    if (format === 'li-view') {
      // By the time this format() method gets called When an existing blot is
      // rendered on editor load, the 'this.domNode' property used in
      // getLiContent() method is not yet initialized. So this waits a while
      // until it is initialized to run the formatting
      setTimeout(() => {
        const {
          liId,
          authorId,
          zoomState,
          controlsVisibility
        } = this.getLiContent();
        if (liId && authorId && zoomState && value) {
          LearningItemBlot.renderLItoNode(
            liId,
            authorId,
            value,
            value === LiViewTypes.EDIT ? zoomState : value,
            controlsVisibility,
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

// If I register it here it then works, but is undefined why I export/import it in the ReactiveRichText.js file
// Quill.register('formats/learning-item', LearningItemBlot);

export default LearningItemBlot;