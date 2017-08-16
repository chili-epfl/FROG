// @flow

import React from 'react';
import styled from 'styled-components';
import { compose, withState } from 'recompose';
import Mousetrap from 'mousetrap';

const Main = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 96%;
  height: 90%;
  transform: translate(2%, 2%);
`;

const ImgBis = styled.img`
  max-width: 95%;
  max-height: 95%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-53%, -50%);
`;

const Thumbnail = ({ url }) =>
  <div
    style={{
      width: '95%',
      height: '95%',
      margin: 'auto',
      border: 'solid 2px #A0A0A0',
    }}
  >
    <ImgBis alt={''} src={url} />
  </div>;

const ZoomView = ({ invertZoom, images, setIndex, index }) => {
  Mousetrap.bind('left', () => {
    if (index > 0) setIndex(index - 1);
  });
  Mousetrap.bind('right', () => {
    if (index !== images.length - 1) setIndex(index + 1);
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'rgba(50,50,50,0.8)',
      }}
    >
      <button
        onClick={invertZoom}
        className="btn btn-secondary"
        style={{ position: 'absolute', right: '0%' }}
      >
        {' '}<span className="glyphicon glyphicon-remove" />{' '}
      </button>
      <ImgBis alt={''} src={images[index].url} />
    </div>
  );
};

const ThumbList = compose(
  withState('index', 'setIndex', 0),
  withState('zoom', 'setZoom', false),
)(
  ({
    images,
    categoryView,
    setCategoryView,
    setCategorySelected,
    zoom,
    setZoom,
    index,
    setIndex,
  }) => {
    const invertZoom = () => setZoom(false);
    Mousetrap.bind('esc', () => invertZoom());

    return (
      <Main>
        {images.map((x, i) =>
          <button
            key={i.toString()}
            onClick={() => {
              if (!categoryView) {
                setIndex(i);
                setZoom(true);
              } else {
                setCategorySelected(images[i].categories[0]);
                setCategoryView(false);
              }
            }}
            style={{
              left: i * 20 + '%',
              top: '1%',
              width: '20%',
              height: 100 / Math.ceil(images.length / 5) + '%',
              border: 'none',
              background: 'none',
            }}
          >
            <Thumbnail url={x.url} />
          </button>,
        )}
        {zoom &&
          <ZoomView invertZoom={invertZoom} images={images} index={index} setIndex={setIndex} />}
      </Main>
    );
  },
);

export default ThumbList;
