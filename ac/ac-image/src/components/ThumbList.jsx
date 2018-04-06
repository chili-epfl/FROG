// @flow

import React from 'react';
import styled from 'styled-components';
import download from 'downloadjs';

import ImageBox from './ImageBox';
import CategoryBox from './CategoryBox';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  top: 60px;
  bottom: 85px;
  overflow: auto;
`;

const ImageList = ({
  images,
  vote,
  minVoteT,
  canVote,
  userInfo,
  setZoom,
  setIndex,
  logger,
  LearningItem,
  classes
}) => {
  return (
    <Main>
      {images.map((image, i) => {
        const onClick = e => {
          if (canVote && e.shiftKey) {
            vote(image.key, userInfo.id);
          } else if (image.thumbnail || !image.filename) {
            setIndex(i);
            setZoom(true);
            logger({ type: 'zoom', itemId: image.key });
          } else {
            logger({
              type: 'download',
              itemId: image.key,
              value: image.filename
            });
            download(image.url, image.filename);
          }
        };

        const voteCount = Object.values(image.votes || {}).reduce(
          (n, v) => (v ? n + 1 : n),
          0
        );

        const styleCode =
          voteCount >= minVoteT
            ? 'chosen_by_team'
            : voteCount > 0 ? 'chosen_partially' : 'not_chosen';

        return (
          <LearningItem
            key={image}
            type="viewThumb"
            id={image}
            render={props => (
              <ImageBox
                key={image}
                {...{ image, onClick, styleCode }}
                {...props}
              />
            )}
          />
        );
      })}
    </Main>
  );
};

const CategoryList = ({ categories, setCategory, logger }) => (
  <Main>
    {Object.keys(categories).map(category => (
      <CategoryBox
        key={JSON.stringify(category)}
        images={categories[category]}
        category={category}
        setCategory={setCategory}
        logger={logger}
      />
    ))}
  </Main>
);

const ThumbList = (props: Object) => {
  return props.showCategories ? (
    <CategoryList {...props} />
  ) : (
    <ImageList {...props} />
  );
};

ThumbList.displayName = 'ThumbList';
export default ThumbList;
