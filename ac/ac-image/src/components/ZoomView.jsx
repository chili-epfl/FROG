// @flow

import React from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import { ReactiveText } from 'frog-utils';
import Paper from 'material-ui/Paper';
import { withStyles } from 'material-ui/styles';

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
  width: 50%;
  height: 50%;
  top: 25%;
  z-index: 1;
  background: rgba(50, 50, 50, 0.8);
`;

const ZoomView = ({
  close,
  images,
  setIndex,
  index,
  commentBox,
  dataFn,
  logger,
  commentGuidelines,
  LearningItem,
  classes
}: Object) => {
  Mousetrap.bind('left', () => setIndex(Math.max(index - 1, 0)));
  Mousetrap.bind('right', () =>
    setIndex(Math.min(index + 1, images.length - 1))
  );

  return (
    <LearningItem
      id={images[index]}
      type="view"
      render={props => (
        <ZoomContainer>
          <Paper className={classes.root} elevation={24}>
            <CenteredImg>{props.children}</CenteredImg>
            <button
              onClick={close}
              className="btn btn-secondary"
              style={{ position: 'absolute', right: '0px' }}
            >
              <span className="glyphicon glyphicon-remove" />
            </button>
            {commentBox && (
              <ReactiveText
                type="textarea"
                path="comment"
                logger={logger}
                dataFn={props.dataFn}
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
                <i className="fa fa-check" style={{ fontSize: 'xx-large' }} />
              </button>
            )}
          </Paper>
        </ZoomContainer>
      )}
    />
  );
};

ZoomView.displayName = 'ZoomView';
export default withStyles(styles)(ZoomView);
