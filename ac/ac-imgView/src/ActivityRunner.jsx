// @flow

import React from 'react';
import { withState } from 'recompose';

import ThumbList from './ThumbList';
import TopBar from './TopBar';

const ActivityPanel = ({
  activityData,
  data,
  dataFn,
  userInfo,
  categorySelected,
  setCategorySelected
}) => {
  const categories = getAllCategories(data);
  const imgCategory = getCategoryImages(categories.filter(x => x !== 'categories'), data)
  const imagesFiltered = getImagesFiltered(data, categorySelected);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TopBar
        categories={categories}
        categorySelected={categorySelected}
        setCategorySelected={setCategorySelected}
      />
      <ThumbList
        minVote={activityData.config.minVote ? activityData.config.minVote : 1}
        images={
          categorySelected === 'categories' ? imgCategory : imagesFiltered
        }
        data={data}
        dataFn={dataFn}
        id={userInfo.id}
        categorySelected={categorySelected}
        setCategorySelected={setCategorySelected}
      />
    </div>
  );
};

const getAllCategories = images => {
  const categories = ['all', 'categories'];
  if (Object.keys(images).length !== 0)
    Object.keys(images).forEach(
      x =>
        images[x].categories &&
        images[x].categories.forEach(y => {
          if (!categories.includes(y)) categories.push(y);
        })
    );
  return categories;
};

const getCategoryImages = (categories, images) => {
  if (Object.keys(images).length === 0) return [];
  const result = categories.map(x => {
    const image =
      x === 'all'
        ? images[0]
        : Object.keys(images)
            .map(index => images[index])
            .filter(y => y.categories && y.categories.includes(x))[0];
    return {
      categories: x,
      url: image.url
    };
  });
  return result;
};

const getImagesFiltered = (images, categorySelected) =>
  Object.keys(images)
    .map(x => images[x])
    .filter(
      x =>
        categorySelected === 'all' ||
        (x.categories && x.categories.includes(categorySelected))
    );

const ActivityRunner = withState(
  'categorySelected',
  'setCategorySelected',
  'categories'
)(ActivityPanel);

export default ActivityRunner;
