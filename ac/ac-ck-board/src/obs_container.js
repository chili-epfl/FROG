import React from 'react';
import Paper from 'material-ui/Paper';
import AspectRatio from 'react-icons/lib/md/aspect-ratio';
import Draggable from 'react-draggable';
import { shorten } from 'frog-utils';

export default ({ setXY, openInfoFn, observation }) => {
  const style = {
    height: 100,
    width: 300,
    margin: 20,
    textAlign: 'center',
    display: 'inline-block'
  };

  return (
    <Draggable
      onStart = {() => true}
      onStop = {setXY}
      cancel = '.nodrag' >
      <div 
        style = {
          {
            position: 'absolute',
            fontSize: '20px',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            top: observation.y,
            left: observation.x
          }
        } >
        <Paper zDepth = {3} style = {style} >
          <div>
            {shorten(observation.title, 20)}
            <span style = {{float:'right'}} >
              <AspectRatio onClick = {openInfoFn} />
            </span>
          </div>
          <div style =
            {
              {
                fontSize: '15px',
                float: 'left',
                marginTop: '15px',
                marginLeft: '5px'
              }
            }
          >
            {shorten(observation.content, 100)}
          </div>
        </Paper>
      </div>
    </Draggable>
  )
}

