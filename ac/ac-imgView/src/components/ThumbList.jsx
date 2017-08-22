// @flow

import React from 'react';
import styled from 'styled-components';
import { compose, withState } from 'recompose';
import Mousetrap from 'mousetrap';

import ImageBox from './ImageBox';
import CategoryBox from './CategoryBox';

const Main = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
  overflow: auto;
`;

const ImageListPure = ({
  images,
  vote,
  minVote,
  userInfo,
  setZoom,
  voteMode,
  setVoteMode,
  setIndex
}) => {
  Mousetrap.bind('esc', () => setZoom(false));
  Mousetrap.bind('shift', () => setVoteMode(true), 'keydown');
  Mousetrap.bind('shift', () => setVoteMode(false), 'keyup');

  return (
    <Main>
      {images.map((image, i) => {
        const onClick = () => {
          if (voteMode) {
            vote(image.key, userInfo.id);
          } else {
            setIndex(i);
            setZoom(true);
          }
        };

        const voteCount = Object.values(image.votes).reduce(
          (n, v) => (v ? n + 1 : n),
          0
        );

        const styleCode = image.votes[userInfo.id]
          ? voteCount >= (minVote || 0)
            ? 'chosen_by_team_and_student'
            : 'chosen_by_student_only'
          : voteCount >= (minVote || 0)
            ? 'chosen_by_team_but_not_student'
            : 'not_chosen';

        return (
          <ImageBox
            key={JSON.stringify(image)}
            {...{ image, onClick, styleCode }}
          />
        );
      })}
    </Main>
  );
};

const ImageList = compose(withState('voteMode', 'setVoteMode', false))(
  ImageListPure
);

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

export default ({
  images,
  categories,
  setCategory,
  minVote,
  vote,
  userInfo,
  showingCategories,
  setZoom,
  setIndex
}: {
  images: Array<{ url: string, key: string, votes: Object }>,
  categories: Object,
  setCategory: Function,
  minVote: number,
  vote: Function,
  userInfo: Object,
  showingCategories: boolean,
  setZoom: Function,
  setIndex: Function
}) =>
  showingCategories
    ? <CategoryList {...{ categories, setCategory }} />
    : <ImageList {...{ images, minVote, vote, userInfo, setZoom, setIndex }} />;
