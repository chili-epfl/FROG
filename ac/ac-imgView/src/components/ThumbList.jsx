// @flow

import React from 'react';
import styled from 'styled-components';

import ImageBox from './ImageBox';
import CategoryBox from './CategoryBox';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  position: absolute;
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
  logger
}) =>
  <Main>
    {images.map((image, i) => {
      const onClick = e => {
        if (canVote && e.shiftKey) {
          vote(image.key, userInfo.id);
        } else {
          setIndex(i);
          setZoom(true);
          logger('zoom/' + image.key);
        }
      };

      const voteCount = Object.values(image.votes).reduce(
        (n, v) => (v ? n + 1 : n),
        0
      );

      const styleCode =
        voteCount >= minVoteT
          ? 'chosen_by_team'
          : voteCount > 0 ? 'chosen_partially' : 'not_chosen';

      return (
        <ImageBox
          key={JSON.stringify(image)}
          {...{ image, onClick, styleCode }}
        />
      );
    })}
  </Main>;

const CategoryList = ({ categories, setCategory }) =>
  <Main>
    {Object.keys(categories).map(category =>
      <CategoryBox
        key={JSON.stringify(category)}
        images={categories[category]}
        category={category}
        setCategory={setCategory}
      />
    )}
  </Main>;

const ThumbList = (props: {
  images: Array<{ url: string, key: string, votes: Object }>,
  categories: Object,
  setCategory: Function,
  minVoteT: number,
  vote: Function,
  canVote: boolean,
  userInfo: Object,
  showingCategories: boolean,
  setZoom: Function,
  setIndex: Function,
  logger: Function
}) =>
  props.showingCategories
    ? <CategoryList {...props} />
    : <ImageList {...props} />;

ThumbList.displayName = 'ThumbList';
export default ThumbList;
