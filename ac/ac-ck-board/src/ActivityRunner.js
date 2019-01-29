// @flow
import * as React from 'react';
import ResizeAware from 'react-resize-aware';
import { type ActivityRunnerPropsT, values } from 'frog-utils';

import ObservationContainer from './obs_container';
import ObservationDetail from './obs_detail';
import Quadrants from './Quadrants';

class Board extends React.Component<*, *> {
  state = { info: null };

  render() {
    const {
      activityData: { config },
      userInfo,
      data,
      dataFn,
      width,
      height
    } = this.props;
    const LearningItem = dataFn.LearningItem;
    const scaleX = 1000 / width;
    const scaleY = 1000 / height;
    const offsetHeight = 100 / scaleY / 2;
    const offsetWidth = 300 / scaleX / 2;
    const setXY = (i, ui) => {
      const x = (ui.x + offsetWidth) * scaleX;
      const y = (ui.y + offsetHeight) * scaleY;
      dataFn.objInsert([x, y], [i, 'coords']);
    };

    const getQuadrant = coords => {
      const x = (coords[0] + offsetWidth) * scaleX;
      const y = (coords[1] + offsetHeight) * scaleY;
      console.log(x, y);
      if (x > 660) {
        if (y > 550) {
          return 4;
        } else {
          return 2;
        }
      } else if (y > 550) {
        return 3;
      } else {
        return 1;
      }
    };

    if (!width || !height) {
      return null;
    }

    const canDragOwn = !config.studentEditOthers;
    const canDragOthers = !config.studentEditOwn;
    return (
      <div
        style={{
          maxWidth: width + ' px',
          maxHeight: height + ' px',
          position: 'relative',
          overflow: 'none'
        }}
      >
        {config.allowCreate && (
          <div
            style={{
              zIndex: 9,
              position: 'absolute',
              right: '0px',
              top: '0px'
            }}
          >
            <LearningItem
              type="create"
              autoInsert
              liType={config.onlySpecificLI && config.liType}
              meta={{
                coords: [
                  Math.random() * 650 + 150,
                  -(Math.random() * 800) - 100
                ],
                userid: userInfo.id,
                username: userInfo.name
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
        {config.quadrants && (
          <Quadrants config={config} width={width} height={height} />
        )}
        {width &&
          height &&
          values(data)
            .filter(x => x.li)
            .map(y => (
              <div key={y.id}>
                <ObservationContainer
                  hasQuadrants={config.quadrants}
                  setXY={(_, ui) => setXY(y.id, ui)}
                  openInfoFn={() => this.setState({ info: y.li })}
                  scaleY={scaleY}
                  scaleX={scaleX}
                  getQuadrant={getQuadrant}
                  x={y.coords[0] / scaleX - offsetWidth}
                  y={y.coords[1] / scaleY - offsetHeight}
                  canDrag={
                    y.userid === userInfo.id ? canDragOwn : canDragOthers
                  }
                  username={y.username}
                  showUsername={config.showUsername}
                >
                  <LearningItem disableDragging type="thumbView" id={y.li} />
                </ObservationContainer>
              </div>
            ))}
        {this.state.info && (
          <ObservationDetail closeInfoFn={() => this.setState({ info: null })}>
            <LearningItem id={this.state.info} type="view" />
          </ObservationDetail>
        )}
      </div>
    );
  }
}

export default (props: ActivityRunnerPropsT) => (
  <ResizeAware style={{ position: 'relative', height: '100%', width: '100%' }}>
    <Board {...props} />
  </ResizeAware>
);
