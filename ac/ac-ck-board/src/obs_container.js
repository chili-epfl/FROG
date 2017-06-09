import React from 'react';
import Paper from 'material-ui/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
import Draggable from 'react-draggable';
import { shorten } from 'frog-utils';

export default ({ setXY, openInfoFn, observation }) => {
  const style = {
    height: 50,
    width: 150,
    margin: 5,
    textAlign: 'center',
    display: 'inline-block'
  };

  return (
    <Draggable onStart={() => true} onStop={setXY} cancel=".nodrag">
      <div
        style={{
          position: 'absolute',
          fontSize: '10',
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
              fontSize: '8',
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
