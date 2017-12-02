import React from 'react';
import Paper from 'material-ui/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
import Draggable from 'react-draggable';
import { shorten } from 'frog-utils';

const ObservationContainer = ({
  setXY,
  openInfoFn,
  x,
  scaleY,
  scaleX,
  y,
  title,
  content,
  delBox
}) => {
  const scaleText = (scaleX + scaleY) / 2;
  const style = {
    height: 30 / scaleY,
    width: title.length * 12 / scaleX,
    margin: 10 / scaleText,
    textAlign: 'center',
    display: 'inline-block'
  };

  return (
    <Draggable
      onStart={() => true}
      position={{ ...{ x, y } }}
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
        <Paper
          zDepth={3}
          style={style}
          onClick={e => {
            if (e.shiftKey) {
              delBox();
            }
          }}
        >
          <div>
            {shorten(title, 50)}
            {content &&
              <span style={{ float: 'right' }} className="noDrag">
                <AspectRatio onClick={openInfoFn} />
              </span>}
          </div>
          <div
            style={{
              fontSize: 16 / scaleText + 'px',
              float: 'left',
              marginTop: 5 / scaleText + 'px',
              marginLeft: 2 / scaleText + 'px'
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
