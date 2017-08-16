// @flow

import React from 'react';
import { withState, compose } from 'recompose';

import ThumbList from './ThumbList';
import TopBar from './TopBar';
// import type { ActivityRunnerT } from 'frog-utils';

const ActivityRunner = compose(
  withState('categorySelected', 'setCategorySelected', 'all'),
  withState('categoryView', 'setCategoryView', true),
)(({ activityData, categorySelected, setCategorySelected, categoryView, setCategoryView }) => {
  const categories = ['all'];
  activityData.config.images.forEach(
    x =>
      x.categories &&
      x.categories.forEach(y => {
        if (!categories.includes(y)) categories.push(y);
      }),
  );

  const imgCategory = categories.map(x => {
    const image = x === 'all' ? activityData.config.images[0] : activityData.config.images.filter(y => (y.categories && y.categories.includes(x)))[0];
    console.log(image);
    return {
      categories: x,
      url: image.url
    };
  });

  const imagesFiltered = activityData.config.images.filter(
    x => categorySelected === 'all' || (x.categories && x.categories.includes(categorySelected)),
  );

  const images = categoryView ? imgCategory : imagesFiltered;

  console.log(imgCategory);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {!categoryView &&
        <TopBar
          categories={categories}
          categorySelected={categorySelected}
          setCategorySelected={setCategorySelected}
        />}
      <ThumbList
        images={images}
        categoryView={categoryView}
        setCategoryView={setCategoryView}
        setCategorySelected={setCategorySelected}
      />
    </div>
  );
});

export default ActivityRunner;
