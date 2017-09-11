import React from 'react';
import Paper from 'material-ui/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
import Draggable from 'react-draggable';
import { shorten } from 'frog-utils';

const ObservationContainer = ({
  setXY,
  openInfoFn,
  observation,
  x,
  y,
  title,
  content,
  width,
  height
}) => {
  const style = {
    height: 100,
    width: 300,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block'
  };

  return (
    <Draggable onStart={() => true} onDrag={setXY} cancel=".nodrag">
      <div
        style={{
          position: 'absolute',
          fontSize: '10px',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
          top: y,
          left: x
        }}
      >
        <Paper zDepth={3} style={style}>
          <div>
            {shorten(title, 20)}
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
            {shorten(content, 100)}
          </div>
        </Paper>
      </div>
    </Draggable>
  );
};

export default ObservationContainer;
