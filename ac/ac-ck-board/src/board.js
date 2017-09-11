// @flow
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ResizeAware from 'react-resize-aware';
import styled from 'styled-components';
import { withState } from 'recompose';
import { type ActivityRunnerT } from 'frog-utils';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';
import Quadrants from './Quadrants';

const BoardPure = ({
  activityData: { config },
  data,
  dataFn,
  width,
  height,
  info,
  setInfo
}) => {
  const List = data.map((y, i) => {
    const scaleX = 1000 / width;
    const scaleY = 1000 / height;
    console.log(scaleX, scaleY);
    const openInfoFn = y => setInfo(y);
    const setXY = (_, ui) => {
      console.log(ui);
      dataFn.numIncr(ui.deltaX, [i, 'x']);
      dataFn.numIncr(ui.deltaY, [i, 'y']);
    };

    return (
      <ObservationContainer
        key={y.id}
        setXY={setXY}
        openInfoFn={openInfoFn}
        title={y.title}
        content={y.content}
        x={y.x / scaleX}
        y={y.y / scaleY}
      />
    );
  });

  return (
    <MuiThemeProvider>
      <div style={{ height: '100%', width: '100%' }}>
        {config.quadrants &&
          <Quadrants config={config} width={width} height={height} />}
        {config.image &&
          <img
            src={config.imageurl}
            alt="Background"
            style={{ width: width + 'px', height: height + 'px' }}
          />}
        {width && height && List}
      </div>
    </MuiThemeProvider>
  );
};

const Board = withState('info', 'setInfo', null)(BoardPure);

export default (props: ActivityRunnerT) =>
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: relative;
  left: 0px;
  top: 0px;
`;

const BackgroundImage = styled.img`
  width: 100%;
  object-fit: contain;
`;
