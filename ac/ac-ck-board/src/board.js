// @flow
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import ResizeAware from 'react-resize-aware';
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

  const List = data.map((y, i) =>
    <div key={y.id}>
      <ObservationContainer
        setXY={(_, ui) => setXY(i, ui)}
        openInfoFn={() => setInfo(y)}
        title={y.title}
        scaleY={scaleY}
        scaleX={scaleX}
        content={y.content}
        x={y.x / scaleX - offsetWidth}
        y={y.y / scaleY - offsetHeight}
      />
    </div>
  );
  if (!width || !height) {
    return null;
  }
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
        {info &&
          <ObservationDetail
            title={info.title}
            content={info.content}
            closeInfoFn={() => setInfo(null)}
          />}
      </div>
    </MuiThemeProvider>
  );
};

const Board = withState('info', 'setInfo', null)(BoardPure);

export default (props: ActivityRunnerT) =>
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>;
