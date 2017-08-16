// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

const ImgBis = styled.img`
  max-width: 80%;
  max-height: 100%;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
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
        {' '}{i + 1} <span className="glyphicon glyphicon-arrow-right" /> {x}{' '}
      </li>
    )}
  </ul>;

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const categ = activityData.config.categories || [];
  const imgs = activityData.config.images || [];
  categ.forEach((x, i) =>
    Mousetrap.bind((i + 1).toString(), () => {
      dataFn.objInsert(x, data.index + 1);
      dataFn.objInsert(data.index + 1, 'index');
    })
  );

  if (data.index === imgs.length)
    categ.forEach((x, i) => Mousetrap.unbind((i + 1).toString()));

  return (
    <div style={{ margin: '1%', height: '100%' }}>
      <h4>
        {' '}{activityData.config.title}{' '}
      </h4>
      {data.index < imgs.length &&
        <FlexDiv>
          <ImgPanel url={imgs[data.index]} />
          <ShortCutPanel categories={categ} />
        </FlexDiv>}
      {data.index >= imgs.length &&
        <h1>
          {'End of the activity'}
        </h1>}
    </div>
  );
};
