import * as React from 'react';
import MorseNode from './morse.js';

class TextInput extends React.Component {
  componentDidMount() {
    if (!window.morse) {
      window.audioContext = new window.AudioContext();
      window.morse = new MorseNode(window.audioContext, 10);
      window.morse.connect(window.audioContext.destination);
    }
  }

  playAudio = c => {
    window.morse.playChar(window.audioContext.currentTime, c.join(''));
  };

  create = () => {
    this.baseChar = '.';
    setTimeout(() => {
      this.baseChar = '-';
    }, 700);
  };

  update = () => {
    this.props.dataFn.listAppend(this.baseChar, 'string');
  };

  reset = () => {
    this.props.dataFn.objInsert({ string: [] });
  };

  startAudio = () => {
    window.morse.playSound(window.audioContext.currentTime);
    this.create();
  };

  stopAudio = () => {
    window.morse.stopPlaying(window.audioContext.currentTime);
    this.update();
  };

  render() {
    return (
      <div>
        <div
          style={{
            color: this.props.data.string.length > 0 ? 'black' : 'grey'
          }}
        >
          <p>
            {this.props.data.string.length > 0
              ? 'Play morse message'
              : 'Empty morse message'}{' '}
            <span
              role="img"
              onClick={() => this.playAudio(this.props.data.string)}
            >
              🔊
            </span>
          </p>
        </div>
        {this.props.edit && (
          <React.Fragment>
            <button
              onMouseDown={this.startAudio}
              onMouseUp={this.stopAudio}
              onKeyPress={this.onKeyPress}
            >
              press to write morse
            </button>
            <button onClick={() => this.props.dataFn.listAppend('   ', string)}>
              add space
            </button>
            <button onClick={this.reset}>reset</button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default TextInput;
