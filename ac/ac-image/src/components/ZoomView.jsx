// @flow

import React from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import { ReactiveText } from 'frog-utils';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';

import { CenteredImg } from './ImageBox';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 36,
    paddingBottom: 16,
    height: '100%'
  })
});

const ZoomContainer = styled.div`
  position: absolute;
  width: 900px;
  height: 900px;
  z-index: 1;
  background: rgba(50, 50, 50, 0.8);
`;

const ZoomView = ({
  close,
  images,
  setIndex,
  dataFn,
  index,
  commentBox,
  logger,
  commentGuidelines,
  LearningItem,
  classes
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
    <ZoomContainer>
      <Paper className={classes.root} elevation={24}>
        <CenteredImg>
          <LearningItem id={images[index].li} type="view" />
        </CenteredImg>
        <button
          onClick={close}
          className="btn btn-secondary"
          style={{ position: 'absolute', right: '0px' }}
        >
          <div className="bootstrap">
            <span className="glyphicon glyphicon-remove" />
          </div>
        </button>
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
    </ZoomContainer>
  );
};

ZoomView.displayName = 'ZoomView';
export default withStyles(styles)(ZoomView);
