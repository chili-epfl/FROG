import React from 'react';
import Paper from 'material-ui/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
import Draggable from 'react-draggable';
import { shorten } from 'frog-utils';

const ObservationContainer = ({
  parentRef,
  setXY,
  openInfoFn,
  observation
}) => {
  const style = {
    height: 100,
    width: 300,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block'
  };

  return (
    <Draggable
      onStart={() => true}
      onStop={setXY}
      cancel=".nodrag"
      bounds="parent"
      offsetParent={parentRef}
    >
      <div
        style={{
          position: 'absolute',
          fontSize: '10px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          top: observation.y,
          left: observation.x
        }}
      >
        <Paper zDepth={3} style={style}>
          <div>
            {shorten(observation.title, 20)}
            <span style={{ float: 'right' }} className="noDrag">
              <AspectRatio onClick={openInfoFn} />
            </span>
          </div>
          <div
            style={{
              fontSize: '8px',
              float: 'left',
              marginTop: '5px',
              marginLeft: '2px'
            }}
          >
            {shorten(observation.content, 100)}
          </div>
        </Paper>
      </div>
    </Draggable>
  );
};

export default ObservationContainer;
