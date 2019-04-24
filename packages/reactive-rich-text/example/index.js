import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import { Display } from './Display';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Display />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
