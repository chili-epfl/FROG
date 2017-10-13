// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';
import { withState } from 'recompose';

import ShortcutPanel, { shortcuts } from './components/ShortcutPanel';
import ObjectPanel from './components/ObjectPanel';
import ObjectList from './components/ObjectList';

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

export const getType = (obj: Object) => {
  if (obj.url) {
    return 'image';
  } else {
    return obj.type;
  }
};

const isSupportedType = type => {
  return ['table', 'tree', 'image'].includes(type);
};

const RunnerPure = ({
  activityData,
  data,
  dataFn,
  objectKey,
  setObjectKey
}: ActivityRunnerT & { objectKey: string, setObjectKey: Function }) => {
  const objects = Object.keys(data)
    .filter(x => data[x].key !== undefined)
    .map(key => data[key])
    .filter(x => isSupportedType(getType(x)));

  // when imageKey is null, imageKeyPlus takes the value of an image to categorize
  const objectKeyPlus =
    objectKey || (objects.find(obj => !obj.category) || {}).key;

  const assignCategory = categoryName => {
    if (objectKeyPlus) {
      dataFn.objInsert(categoryName, [objectKeyPlus, 'category']);
      dataFn.listAppend(objectKeyPlus, 'seen');
    }
    setObjectKey(null);
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
      {objectKeyPlus
        ? <FlexDiv>
            {<ObjectPanel obj={data[objectKeyPlus]} small={false} />}
            <ShortcutPanel
              {...{
                categories,
                dataFn,
                data,
                assignCategory,
                objectKey: objectKeyPlus
              }}
            />
          </FlexDiv>
        : <h1>Waiting for objects to classify</h1>}
      <ObjectList {...{ objects, objectKey: objectKeyPlus, setObjectKey }} />
    </Main>
  );
};

export default withState('objectKey', 'setObjectKey', null)(RunnerPure);
