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
  dataFn
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
          dataFn={dataFn}
          style={{ position: 'absolute', width: '500px', height: '150px' }}
        />
      )}
    </ZoomContainer>
  );
};

ZoomView.displayName = 'ZoomView';
export default ZoomView;
