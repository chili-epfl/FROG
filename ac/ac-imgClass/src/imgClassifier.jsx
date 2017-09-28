// @flow

import React from 'react';
import Mousetrap from 'mousetrap';
import type { ActivityRunnerT } from 'frog-utils';
import styled from 'styled-components';

const shortCuts = '1234567890abcdefghijklmnopqrstuvwxyz';

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

const ImgPanel = ({ url }) =>
  <div style={{ width: '90%', height: '100%' }}>
    <ImgBis alt="" src={url} />
  </div>;

const ShortCutPanel = ({ categories, dataFn, images, data }) =>
  <div style={{ width: '15%', height: '100%' }}>
    <div
      className="list-group"
      style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)'
      }}
    >
      <div
        className="list-group-item"
        style={{ fontWeight: 'bold', backgroundColor: '#D0D0D0' }}
      >
        Shortcuts :
      </div>
      {categories.map((x, i) =>
        <button
          key={x}
          onClick={() => {
            dataFn.objInsert(
              { url: images[data.index], category: x },
              data.index
            );
            dataFn.objInsert(data.index + 1, 'index');
          }}
          className="list-group-item"
        >
          {shortCuts[i]} <span className="glyphicon glyphicon-arrow-right" />
          {' ' + x}
        </button>
      )}
    </div>
  </div>;

export default ({ activityData, data, dataFn }: ActivityRunnerT) => {
  const categ = activityData.config.categories || [];
  const imgs = Object.keys(data)
    .filter(x => data[x].url !== undefined)
    .filter(x => !data.seen.includes(x));

  let img;
  if (imgs.length > 0) {
    img = data[imgs[0]];
  } else {
    categ.forEach((x, i) => Mousetrap.unbind(shortCuts[i]));
    return <h1>Waiting for images to classify</h1>;
  }

  categ.forEach((x, i) =>
    Mousetrap.bind(shortCuts[i], () => {
      dataFn.objInsert({ category: x }, img.url);
      dataFn.listAppend(imgs[0], 'seen');
    })
  );

  return (
    <div style={{ margin: '1%', height: '100%' }}>
      <h4>
        {activityData.config.title}
      </h4>
      <FlexDiv>
        <ImgPanel url={img.url} />
        <ShortCutPanel
          categories={categ}
          dataFn={dataFn}
          images={imgs}
          data={data}
        />
      </FlexDiv>
    </div>
  );
};
