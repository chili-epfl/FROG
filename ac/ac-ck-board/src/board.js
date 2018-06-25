// @flow
import * as React from 'react';
import ResizeAware from 'react-resize-aware';
import { withState } from 'recompose';
import { type ActivityRunnerPropsT, values } from 'frog-utils';

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
  const LearningItem = dataFn.LearningItem;
  const scaleX = 1000 / width;
  const scaleY = 1000 / height;
  const offsetHeight = 100 / scaleY / 2;
  const offsetWidth = 300 / scaleX / 2;
  const setXY = (i, ui) => {
    dataFn.objInsert((ui.x + offsetWidth) * scaleX, [i, 'x']);
    dataFn.objInsert((ui.y + offsetHeight) * scaleY, [i, 'y']);
  };

  if (!width || !height) {
    return null;
  }
  return (
    <div
      style={{
        width: width + ' px',
        height: height + ' px',
        position: 'relative'
      }}
    >
      {config.allowCreate && (
        <div
          style={{ zIndex: 9, position: 'absolute', right: '0px', top: '0px' }}
        >
          <LearningItem
            type="create"
            autoInsert
            meta={{
              x: Math.random() * 650 + 150,
              y: -(Math.random() * 800) - 100
            }}
          />
        </div>
      )}
      {config.image && (
        <img
          src={config.imageurl}
          alt="Background"
          style={{ width: width + 'px', height: height + 'px' }}
        />
      )}
      {!config.image && (
        <div style={{ width: width + 'px', height: height + 'px' }} />
      )}
      {width &&
        height &&
        values(data).map(y => (
          <div key={y.id}>
            <ObservationContainer
              setXY={(_, ui) => setXY(y.id, ui)}
              openInfoFn={() => setInfo(y.li)}
              scaleY={scaleY}
              scaleX={scaleX}
              x={y.x / scaleX - offsetWidth}
              y={y.y / scaleY - offsetHeight}
            >
              <LearningItem disableDragging type="thumbView" id={y.li} />
            </ObservationContainer>
          </div>
        ))}
      {config.quadrants && (
        <Quadrants config={config} width={width} height={height} />
      )}
      {info && (
        <ObservationDetail closeInfoFn={() => setInfo(null)}>
          <LearningItem id={info} type="view" />
        </ObservationDetail>
      )}
    </div>
  );
};

const Board = withState('info', 'setInfo', null)(BoardPure);

export default (props: ActivityRunnerPropsT) => (
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>
);
