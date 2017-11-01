// @flow

import React from 'react';
import styled from 'styled-components';
import Mousetrap from 'mousetrap';
import { ReactiveText } from 'frog-utils';

import CenteredImg from './CenteredImg';

const ZoomContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
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
  commentGuidelines
}: Object) => {
  Mousetrap.bind('left', () => setIndex(Math.max(index - 1, 0)));
  Mousetrap.bind('right', () =>
    setIndex(Math.min(index + 1, images.length - 1))
  );

  return (
    <ZoomContainer>
      <CenteredImg url={images[index].url} />
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
          path={[images[index].key, 'comment']}
          logger={logger}
          dataFn={dataFn}
          placeholder={commentGuidelines}
          style={{
            fontSize: '22px',
            position: 'absolute',
            width: '100%',
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
    </ZoomContainer>
  );
};

ZoomView.displayName = 'ZoomView';
export default ZoomView;
