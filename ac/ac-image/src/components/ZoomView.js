// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import { ReactiveText } from 'frog-utils';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  dialogPaper: {
    minWidth: '30vw',
    maxWidth: '30vw',
    minHeight: '70vh',
    maxHeight: '70vh'
  }
};

const ZoomView = ({
  close,
  images,
  setIndex,
  dataFn,
  index,
  commentBox,
  logger,
  classes,
  commentGuidelines,
  LearningItem
}: Object) => {
  Mousetrap.bind('left', e => {
    e.preventDefault();
    setIndex(Math.max(index - 1, 0));
  });
  Mousetrap.bind('right', e => {
    e.preventDefault();
    setIndex(Math.min(index + 1, images.length - 1));
  });

  return (
    <Dialog open classes={{ paper: classes.dialogPaper }}>
      <Paper depth={24}>
        <div style={{ position: 'absolute', right: '0px' }}>
          <IconButton color="inherit" onClick={close} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <LearningItem id={images[index].li} type="view" />
        {commentBox && (
          <ReactiveText
            type="textarea"
            path={[images[index].id, 'comment']}
            logger={logger}
            dataFn={dataFn}
            placeholder={commentGuidelines}
            style={{
              fontSize: '22px',
              position: 'absolute',
              width: '50%',
              height: '100px',
              bottom: '0px'
            }}
          />
        )}
        {commentBox && (
          <button
            onClick={close}
            className="btn btn-success"
            style={{
              position: 'absolute',
              right: '0px',
              bottom: '0px',
              height: '100px',
              width: '100px'
            }}
          >
            <div className="bootstrap">
              {' '}
              <i className="fa fa-check" style={{ fontSize: 'xx-large' }} />
            </div>
          </button>
        )}
      </Paper>
    </Dialog>
  );
};

ZoomView.displayName = 'ZoomView';
export default withStyles(styles)(ZoomView);
