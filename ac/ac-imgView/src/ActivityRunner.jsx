// @flow

import React from 'react';
import { withState } from 'recompose';
import styled from 'styled-components';

import ThumbList from './components/ThumbList';
import TopBar from './components/TopBar';

const Main = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
`;

const ActivityPanel = ({
  activityData: { config: { minVote } },
  data,
  dataFn,
  userInfo,
  category,
  setCategory
}) => {
  const categories = Object.keys(data).reduce(
    (acc, key) => ({
      ...acc,
      all: [...(acc.all || []), data[key].url],
      ...(data[key].categories &&
        data[key].categories.reduce(
          (_acc, cat) => ({
            ..._acc,
            [cat]: [...(acc[cat] || []), data[key].url]
          }),
          {}
        ))
    }),
    {}
  );

  const images = Object.keys(data)
    .filter(
      key =>
        data[key] !== undefined &&
        data[key].url !== undefined &&
        (category === 'all' ||
          (data[key].categories !== undefined &&
            data[key].categories.includes(category)))
    )
    .map(key => ({ ...data[key], key }));

  const vote = (key, userId) => {
    const prev = data[key].votes ? data[key].votes[userId] : false;
    dataFn.objInsert(!prev, [key, 'votes', userId]);
  };

  return (
    <Main>
      <TopBar
        categories={[...Object.keys(categories), 'categories']}
        category={category}
        setCategory={setCategory}
      />
      <ThumbList
        {...{ images, categories, minVote, vote, userInfo, category }}
        {...{ setCategory, showingCategories: category === 'categories' }}
      />
    </Main>
  );
};

const ActivityRunner = withState('category', 'setCategory', 'categories')(
  ActivityPanel
);

export default ActivityRunner;
