import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

const srcs = [
  'http://localhost:3000/api/activityType/ac-quiz?config=%7B%22title%22%3A%22This%20is%20my%20quiz%22%2C%22shuffle%22%3A%22none%22%2C%22guidelines%22%3A%22Important%20stuff%22%2C%22questions%22%3A%5B%7B%22question%22%3A%22Questoin%201%22%2C%22answers%22%3A%5B%22a%22%2C%22b%22%5D%7D%5D%7D&instance_id=1',
  'http://localhost:3000/api/activityType/ac-video?config=%7B%22url%22%3A%22https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6YAHzyRRY8Q%22%2C%22playing%22%3Atrue%7D&instance_id=1',
  'http://localhost:3000/api/activityType/ac-image?config=%7B%22canUpload%22%3Atrue%7D&instance_id=1'
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], example: 0 };
  }
  componentDidMount = () => {
    var eventMethod = window.addEventListener
      ? 'addEventListener'
      : 'attachEvent';
    var eventer = window[eventMethod];
    var messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';
    eventer(messageEvent, e => {
      if (e.data && e.data.type === 'frog-log') {
        this.setState({ logs: [...this.state.logs, e.data] });
      }
    });
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        Examples:{' '}
        {srcs.map((x, i) => (
          <span>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                console.log(i);
                this.setState({ example: i });
              }}
            >
              {i}
            </a>
            {'      '}
          </span>
        ))}
        <div style={{ display: 'flex' }}>
          <div>
            <iframe
              src={srcs[this.state.example]}
              width="800px"
              height="800px"
            />
          </div>
          <div>
            <h1>Logs</h1>
            {this.state.logs.map(x => <li>{JSON.stringify(x)}</li>)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
