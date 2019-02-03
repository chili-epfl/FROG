import React from 'react';
import Paper from '@material-ui/core/Paper';
import { MdAspectRatio } from 'react-icons/md';
import Draggable from 'react-draggable';

const quadrantColors = ['', '#e7ffac', '#fbe4ff', '#dcd3ff', '#ffccf9'];

class ObservationContainer extends React.Component<*, *> {
  state = { dragXY: null };

  render() {
    const {
      setXY,
      openInfoFn,
      x,
      y,
      scaleY,
      scaleX,
      children,
      canDrag,
      username,
      showUsername,
      hasQuadrants,
      getQuadrant
    } = this.props;

    const scaling = 1 / ((scaleX + scaleY) / 2) / 1.3;

    return (
      <Draggable
        onStart={() => true}
        onDrag={(_, ui) => this.setState({ dragXY: [ui.x, ui.y] })}
        onEnd={() => this.setState({ dragXY: null })}
        disabled={!canDrag}
        position={{
          x,
          y
        }}
        onStop={setXY}
        cancel=".nodrag"
      >
        <div>
          <Paper
            elevation={24}
            style={{
              transform: `scale(${scaling}`,
              transformOrigin: '0 0',
              position: 'absolute',
              background:
                hasQuadrants &&
                quadrantColors[getQuadrant(this.state.dragXY || [x, y])],
              height: 'inherit',
              width: 'inherit',
              display: 'block'
            }}
          >
            <div style={{ margin: '15px', maxWidth: '500px' }}>
              <span style={{ float: 'right' }} className="noDrag">
                <MdAspectRatio onClick={openInfoFn} />
              </span>
              {children}
              {showUsername && <i>{username}</i>}
            </div>
          </Paper>
        </div>
      </Draggable>
    );
  }
}

export default ObservationContainer;
