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
    const style = {
      transform: `scale(${scaling}`,
      textAlign: 'center',
      display: 'inline-block'
    };

    return (
      <Draggable
        onStart={() => true}
        onDrag={ui => this.setState({ dragXY: [ui.x, ui.y] })}
        onEnd={() => this.setState({ dragXY: null })}
        disabled={!canDrag}
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
            style={{
              background:
                hasQuadrants &&
                quadrantColors[
                  getQuadrant(
                    this.state.dragXY
                      ? { raw: true, coords: this.state.dragXY }
                      : { raw: true, coords: [x, y] }
                  )
                ],
              height: 'inherit',
              width: 'inherit',
              ...style
            }}
          >
            <div style={{ margin: '15px', maxWidth: '500px' }}>
              <div>
                <span style={{ float: 'right' }} className="noDrag">
                  <MdAspectRatio onClick={openInfoFn} />
                </span>
              </div>
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
