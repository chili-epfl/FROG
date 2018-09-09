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
    margin: '15px',
    minWidth: '30vw'
  }
};

const ZoomView = ({
  close,
  learningItems,
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
    setIndex(Math.min(index + 1, learningItems.length - 1));
  });

  return (
    <Dialog maxWidth="md" open classes={{ paper: classes.dialogPaper }}>
      <Paper depth={24}>
        <div style={{ position: 'absolute', right: '0px' }}>
          <IconButton color="inherit" onClick={close} aria-label="Close">
            <CloseIcon />
          </IconButton>
        </div>
        <div style={{ margin: '20px' }}>
          <LearningItem id={learningItems[index].li} type="view" />
          {commentBox && (
            <ReactiveText
              type="textarea"
              path={[learningItems[index].id, 'comment']}
              logger={logger}
              dataFn={dataFn}
              placeholder={commentGuidelines}
              style={{
                fontSize: '16px',
                position: 'relative',
                width: '80%',
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
                right: '2px',
                bottom: '2px'
              }}
            >
              <div className="bootstrap">
                {' '}
                <i className="fa fa-check" style={{ fontSize: 'xx-large' }} />
              </div>
            </button>
          )}
        </div>
      </Paper>
    </Dialog>
  );
};

ZoomView.displayName = 'ZoomView';
export default withStyles(styles)(ZoomView);
