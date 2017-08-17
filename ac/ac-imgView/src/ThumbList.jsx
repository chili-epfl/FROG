// @flow

import React from 'react';
import styled from 'styled-components';
import { compose, withState } from 'recompose';
import Mousetrap from 'mousetrap';

const ThumbListPure = ({
  images,
  categorySelected,
  setCategorySelected,
  zoom,
  setZoom,
  index,
  setIndex
}) => {
  const zoomToFalse = () => setZoom(false);
  Mousetrap.bind('esc', () => zoomToFalse());

  return (
    <Main>
      {images.map((x, i) =>
        <ImgButton
          key={i.toString()}
          onClick={() => {
            if (categorySelected !== 'categories') {
              setIndex(i);
              setZoom(true);
            } else {
              setCategorySelected(images[i].categories);
            }
          }}
          style={{
            left: i * 20 + '%',
            height: Math.min(50, 100 / Math.ceil(images.length / 5)) + '%'
          }}
        >
          <Thumbnail image={x} categorySelected={categorySelected} />
        </ImgButton>
      )}
      {zoom &&
        <ZoomView
          zoomToFalse={zoomToFalse}
          images={images}
          index={index}
          setIndex={setIndex}
        />}
    </Main>
  );
};

const Thumbnail = ({ image, categorySelected }) =>
  <ThumbnailContainer>
    <div
      style={{
        height: categorySelected !== 'categories' ? '100%' : '90%',
        margin: 'auto'
      }}
    >
      <ImgBis alt={''} src={image.url} />
    </div>
    {categorySelected === 'categories' &&
      <div style={{ height: '10%' }}>
        {' '}{image.categories}{' '}
      </div>}
  </ThumbnailContainer>;

const ZoomView = ({ zoomToFalse, images, setIndex, index }) => {
  Mousetrap.bind('left', () => {
    if (index > 0) setIndex(index - 1);
  });
  Mousetrap.bind('right', () => {
    if (index !== images.length - 1) setIndex(index + 1);
  });

  return (
    <ZoomContainer>
      <button
        onClick={zoomToFalse}
        className="btn btn-secondary"
        style={{ position: 'absolute', right: '0%' }}
      >
        {' '}<span className="glyphicon glyphicon-remove" />{' '}
      </button>
      <ImgBis alt={''} src={images[index].url} />
    </ZoomContainer>
  );
};

const Main = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
  height: 89%;
  transform: translate(2%, 2%);
`;

const ZoomContainer = styled.div`
  width: 100%;
  height: 110%;
  position: absolute;
  transform: translateY(-10%);
  background: rgba(50, 50, 50, 0.8);
`;

const ThumbnailContainer = styled.div`
  width: 95%;
  height: 95%;
  border: solid 2px #a0a0a0;
`;

const ImgBis = styled.img`
  max-width: 95%;
  max-height: 95%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-53%, -50%);
`;

const ImgButton = styled.button`
  top: 1%;
  width: 20%;
  border: none;
  background: none;
`;

const ThumbList = compose(
  withState('index', 'setIndex', 0),
  withState('zoom', 'setZoom', false)
)(ThumbListPure);

export default ThumbList;
