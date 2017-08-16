// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

const ImgBis = styled.img`
  maxWidth: 80%;
  maxHeight: 100%;
  position: relative;
  left: 50%';
top: 50%';
  transform: translate(-50%, -50%);
`;

const FlexDiv = styled.div`
  display: flex;
  flexDirection: row;
  width: 100%;
  height: 90%;
`;

const ImgPanel = (props: { url: string }) =>
  <div style={{ width: '90%', height: '100%' }}>
    <ImgBis alt="" src={props.url} />{' '}
  </div>;

const ShortCutPanel = (props: { categories: Array<string> }) =>
  <ul className="list-group" style={{ width: '20%' }}>
    {props.categories.map((x, i) =>
      <li key={x} className="list-group-item">
        {' '}{i} <span className="glyphicon glyphicon-arrow-right" /> {x}{' '}
      </li>,
    )}
  </ul>;

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  activityData.config.categories.forEach((x, i) =>
    Mousetrap.bind(i.toString(), () => {
      dataFn.objInsert(x, data.index);
      dataFn.objInsert(data.index + 1, 'index');
    }),
  );

  return (
    <div style={{ margin: '1%', height: '100%' }}>
      <h4>
        {' '}{activityData.config.title}{' '}
      </h4>
      {data.index < activityData.config.images.length &&
        <FlexDiv>
          <ImgPanel url={activityData.config.images[data.index]} />
          <ShortCutPanel categories={activityData.config.categories} />
        </FlexDiv>}
      {data.index >= activityData.config.images.length &&
        <h1>
          {'End of the activity'}
        </h1>}
    </div>
  );
};
