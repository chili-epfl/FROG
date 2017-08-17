// @flow

import React from 'react';
import { withState } from 'recompose';

import ThumbList from './ThumbList';
import TopBar from './TopBar';

const ActivityPanel = ({
  activityData,
  categorySelected,
  setCategorySelected
}) => {
  const categories = getAllCategories(activityData.config.images);
  const imgCategory = getCategoryImages(
    categories.filter(x => x !== 'categories'),
    activityData.config.images
  );
  const imagesFiltered = getImagesFiltered(
    activityData.config.images,
    categorySelected
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <TopBar
        categories={categories}
        categorySelected={categorySelected}
        setCategorySelected={setCategorySelected}
      />
      <ThumbList
        images={
          categorySelected === 'categories' ? imgCategory : imagesFiltered
        }
        categorySelected={categorySelected}
        setCategorySelected={setCategorySelected}
      />
    </div>
  );
};

const getAllCategories = images => {
  const categories = ['all', 'categories'];
  images.forEach(
    x =>
      x.categories &&
      x.categories.forEach(y => {
        if (!categories.includes(y)) categories.push(y);
      })
  );
  return categories;
};

const getCategoryImages = (categories, images) => {
  const result = categories.map(x => {
    const image =
      x === 'all'
        ? images[0]
        : images.filter(y => y.categories && y.categories.includes(x))[0];
    return {
      categories: x,
      url: image.url
    };
  });
  return result;
};

const getImagesFiltered = (images, categorySelected) =>
  images.filter(
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
