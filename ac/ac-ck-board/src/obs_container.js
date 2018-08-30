import React from 'react';
import Paper from '@material-ui/core/Paper';
import { AspectRatio } from 'react-icons/md';
import Draggable from 'react-draggable';

const ObservationContainer = ({
  setXY,
  openInfoFn,
  x,
  scaleY,
  scaleX,
  y,
  children
}) => {
  const scaleText = (scaleX + scaleY) / 2;
  const style = {
    height: 100 / scaleY,
    width: 300 / scaleX,
    margin: 20 / scaleText,
    textAlign: 'center',
    display: 'inline-block',
    overflow: 'hidden'
  };

  return (
    <Draggable
      onStart={() => true}
      position={{
        x,
        y
      }}
      onStop={setXY}
      cancel=".nodrag"
    >
      <div
        style={{
          position: 'absolute',
          fontSize: 20 / scaleText + 'px',
          textOverflow: 'ellipsis',
          overflow: 'hidden'
        }}
      >
        <Paper elevation={3} style={style}>
          <div>
            <span style={{ float: 'right' }} className="noDrag">
              <AspectRatio onClick={openInfoFn} />
            </span>
          </div>
          {children}
        </Paper>
      </div>
    </Draggable>
  );
};

export default ObservationContainer;
