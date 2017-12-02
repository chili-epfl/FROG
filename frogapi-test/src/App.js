import React, { Component } from 'react';
import logo from './logo.svg';
import Stringify from 'json-stringify-pretty-compact';
import './App.css';

const srcs = [
  'http://localhost:3000/api/activityType/ac-quiz?config=%7B%22title%22%3A%22This%20is%20my%20quiz%22%2C%22shuffle%22%3A%22none%22%2C%22guidelines%22%3A%22Important%20stuff%22%2C%22questions%22%3A%5B%7B%22question%22%3A%22Questoin%201%22%2C%22answers%22%3A%5B%22a%22%2C%22b%22%5D%7D%5D%7D&instance_id=1&userid=330&username=Petrovsky',
  'http://localhost:3000/api/activityType/ac-video?config=%7B%22url%22%3A%22https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6YAHzyRRY8Q%22%2C%22playing%22%3Atrue%7D&instance_id=1&userid=330&username=Petrovsky',
  'http://localhost:3000/api/activityType/ac-image?config=%7B%22canUpload%22%3Atrue%7D&instance_id=1&userid=330&username=Petrovsky',
  'http://localhost:3000/api/config/ac-quiz',
  'http://localhost:3000/api/chooseActivity'
];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: [], example: 0, valid: undefined };
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
      if (e.data && e.data.type === 'frog-config') {
        this.setState({
          aT: e.data.activityType,
          config: e.data.config,
          valid: e.data.valid,
          errors: e.data.errors
        });
      }
    });
  };
  render() {
    return (
      <div className="App">
        <h1 className="App-title">FROG API test bed</h1>
        Examples:{' '}
        {srcs.map((x, i) => (
          <span>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  example: i,
                  valid: undefined,
                  errors: i < 3 ? undefined : [],
                  config: undefined,
                  logs: [],
                  activityType: undefined
                });
              }}
            >
              {i}
            </a>
            {'      '}
          </span>
        ))}
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div>
            <iframe
              src={this.state.url || srcs[this.state.example]}
              width="600px"
              height="600px"
            />
          </div>
          <div style={{ textAlign: 'left', marginLeft: '20px' }}>
            {Array.isArray(this.state.errors) ? (
              <div>
                <h3>Config data</h3>
                <b>Activity type</b>: {this.state.aT}
                <br />
                <b>Valid?</b>:{' '}
                {this.state.valid ? (
                  <a
                    href={`http://localhost:3000/api/activityType/${
                      this.state.aT
                    }?config=${encodeURIComponent(
                      JSON.stringify(this.state.config)
                    )}&userid=330&username=Petrovsky',`}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        url: `http://localhost:3000/api/activityType/${
                          this.state.aT
                        }?config=${encodeURIComponent(
                          JSON.stringify(this.state.config)
                        )}&userid=330&username=Petrovsky',`
                      });
                    }}
                  >
                    Load activity
                  </a>
                ) : (
                  'No'
                )}
                <br />
                <b>Errors</b>: {JSON.stringify(this.state.errors)}
                <br />
                <b>Config</b>: {JSON.stringify(this.state.config)}
                <br />
              </div>
            ) : (
              <div>
                <h3>Logs</h3>
                <div
                  style={{
                    overflowY: 'scroll',
                    height: '740px',
                    display: 'flex',
                    flexDirection: 'column-reverse'
                  }}
                >
                  {this.state.logs
                    .slice(-30)
                    .reverse()
                    .map(x => (
                      <div>
                        <pre>{Stringify(x.msg)}</pre>
                        <hr />
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
