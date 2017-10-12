// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';
import { withState } from 'recompose';

import ShortcutPanel, { shortcuts } from './components/ShortcutPanel';
import ImagePanel from './components/ImagePanel';
import ImageList from './components/ImageList';

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 700px;
  padding: 5%;
  flex: 0 1 auto;
`;

const RunnerPure = ({
  activityData,
  data,
  dataFn,
  imageKey,
  setImageKey
}: ActivityRunnerT & { imageKey: string, setImageKey: Function }) => {
  const images = Object.keys(data)
    .filter(x => data[x].url !== undefined)
    .map(key => data[key]);

  // when imageKey is null, imageKeyPlus takes the value of an image to categorize
  const imageKeyPlus =
    imageKey || (images.find(image => !image.category) || {}).key;

  const assignCategory = categoryName => {
    if (imageKeyPlus) {
      dataFn.objInsert(categoryName, [imageKeyPlus, 'category']);
      dataFn.listAppend(imageKeyPlus, 'seen');
    }
    setImageKey(null);
  };

  const categories = activityData.config.categories || [];
  categories.forEach((x, i) =>
    Mousetrap.bind(shortcuts[i], () => {
      assignCategory(x);
    })
  );

  return (
    <Main>
      <h2>
        {activityData.config.title}
      </h2>
      {imageKeyPlus
        ? <FlexDiv>
            <ImagePanel url={data[imageKeyPlus].url} />
            <ShortcutPanel
              {...{
                categories,
                dataFn,
                data,
                assignCategory,
                imageKey: imageKeyPlus
              }}
            />
          </FlexDiv>
        : <h1>Waiting for images to classify</h1>}
      <ImageList {...{ images, imageKey: imageKeyPlus, setImageKey }} />
    </Main>
  );
};

export default withState('imageKey', 'setImageKey', null)(RunnerPure);
