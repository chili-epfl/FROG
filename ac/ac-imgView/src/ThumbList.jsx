// @flow

import React from 'react';
import styled from 'styled-components';
import { compose, withState } from 'recompose';
import Mousetrap from 'mousetrap';

const ThumbListPure = ({
  images,
  data,
  dataFn,
  id,
  minVote,
  categorySelected,
  setCategorySelected,
  zoom,
  setZoom,
  index,
  setIndex,
  voteMode,
  setVoteMode
}) => {
  const zoomToFalse = () => setZoom(false);
  Mousetrap.bind('esc', () => zoomToFalse());
  Mousetrap.bind('shift', () => setVoteMode(true), 'keydown');
  Mousetrap.bind('shift', () => setVoteMode(false), 'keyup');

  return (
    <Main>
      {images.map((x, i) => {
        const finalIndex = Object.keys(data).filter(
          y => data[y].url === x.url
        )[0];
        const voteCode =
          data[finalIndex].ids.length === 0
            ? 0
            : data[finalIndex].ids.length < minVote ? 1 : 2;
        return (
          <ImgButton
            key={i.toString()}
            onClick={() => {
              if (categorySelected !== 'categories') {
                if (voteMode) {
                  if (!data[finalIndex].ids.includes(id))
                    dataFn.objInsert(
                      {
                        url: x.url,
                        categories: x.categories,
                        ids: [...data[i].ids, id]
                      },
                      finalIndex
                    );
                  else
                    dataFn.objInsert(
                      {
                        url: x.url,
                        categories: x.categories,
                        ids: data[i].ids.filter(z => z !== id)
                      },
                      finalIndex
                    );
                } else {
                  setIndex(i);
                  setZoom(true);
                }
              } else {
                setCategorySelected(images[i].categories);
              }
            }}
            style={{
              left: i * 20 + '%',
              height: Math.min(50, 100 / Math.ceil(images.length / 5)) + '%'
            }}
          >
            <Thumbnail
              image={x}
              categorySelected={categorySelected}
              voteCode={voteCode}
            />
          </ImgButton>
        );
      })}
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

const Thumbnail = ({ image, categorySelected, voteCode }) =>
  <ThumbnailContainer
    style={
      categorySelected !== 'categories'
        ? getStyle(voteCode)
        : { border: 'solid 2px #a0a0a0' }
    }
  >
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

const getStyle = voteCode => {
  switch (voteCode) {
    case 1:
      return { border: 'solid 4px #FFFF00', borderRadius: '5px' };
    case 2:
      return { border: 'solid 4px #009900', borderRadius: '5px' };
    default:
      return { border: 'solid 2px #a0a0a0' };
  }
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
  background: rgba(50, 50, 50, 0.8);
  transform: translateY(-10%);
`;

const ThumbnailContainer = styled.div`
  width: 95%;
  height: 95%;
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
  withState('zoom', 'setZoom', false),
  withState('voteMode', 'setVoteMode', false)
)(ThumbListPure);

export default ThumbList;
