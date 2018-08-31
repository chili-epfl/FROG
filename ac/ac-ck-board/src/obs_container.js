import React from 'react';
import Paper from '@material-ui/core/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
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
  const scaling = 1 / ((scaleX + scaleY) / 2) / 1.3;
  const style = {
    transform: `scale(${scaling}`,
    textAlign: 'center',
    display: 'inline-block'
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
          textOverflow: 'ellipsis'
        }}
      >
        <Paper
          elevation={24}
          style={{ height: 'inherit', width: 'inherit', ...style }}
        >
          <div style={{ margin: '15px', maxWidth: '500px' }}>
            <div>
              <span style={{ float: 'right' }} className="noDrag">
                <AspectRatio onClick={openInfoFn} />
              </span>
            </div>
            {children}
          </div>
        </Paper>
      </div>
    </Draggable>
  );
};

export default ObservationContainer;
