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
  const scaleX = 1000 / width;
  const scaleY = 1000 / height;
  const offsetHeight = 100 / scaleY / 2;
  const offsetWidth = 300 / scaleX / 2;
  const setXY = (i, ui) => {
    dataFn.objInsert((ui.x + offsetWidth) * scaleX, [i, 'x']);
    dataFn.objInsert((ui.y + offsetHeight) * scaleY, [i, 'y']);
  };

  const List = data.map((y, i) => {
    return (
      <div key={y.id}>
        <ObservationContainer
          setXY={(_, ui) => setXY(i, ui)}
          openInfoFn={y => setInfo(y)}
          title={y.title}
          scaleY={scaleY}
          scaleX={scaleX}
          content={y.content}
          x={y.x / scaleX - offsetWidth}
          y={y.y / scaleY - offsetHeight}
        />
      </div>
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
