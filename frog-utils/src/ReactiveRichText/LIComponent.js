// @flow

import React from 'react';
import { get } from 'lodash';
import Paper from '@material-ui/core/Paper';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import FileCopy from '@material-ui/icons/FileCopy';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Create from '@material-ui/icons/Create';
import IconButton from '@material-ui/core/IconButton';
import { withStyles } from '@material-ui/core/styles';

import { LiViewTypes } from './constants';
import { reactiveRichTextDataFn } from './main';

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

// Bug fix for problem with styles in embedded Hypothesis LIs
const hypothesisStyleFix = document.createElement('style');
hypothesisStyleFix.type = 'text/css';
hypothesisStyleFix.innerHTML = `.ql-editor annotation-viewer-content li::before { content: none; }`;
document.documentElement // $FlowFixMe
  .getElementsByTagName('head')[0]
  .appendChild(hypothesisStyleFix);

const LIComponentRaw = ({
  id,
  authorId,
  classes,
  liView,
  liZoomState,
  controls
}) => {
  const learningTypesObj = reactiveRichTextDataFn.getLearningTypesObj();
  const LearningItem = reactiveRichTextDataFn.LearningItem;
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

export default LIComponent;
