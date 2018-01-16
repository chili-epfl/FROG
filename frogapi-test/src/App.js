import React, { Component } from 'react';
import logo from './logo.svg';
import Stringify from 'json-stringify-pretty-compact';
import './App.css';

const srcs = [
  ['H5P interactive video', 'http://localhost:8000/demo'],
  [
    'Quiz',
    'http://localhost:3000/api/activityType/ac-quiz?config=%7B%22title%22%3A%22Identify%20the%20elephants%22%2C%22shuffle%22%3A%22none%22%2C%22hasAnswers%22%3Atrue%2C%22questions%22%3A%5B%7B%22question%22%3A%22%3Cp%3EWhat%20kind%20of%20elephant%20is%20this%3F%3C%2Fp%3E%5Cn%3Cp%3E%3Cimg%20src%3D%5C%22http%3A%2F%2Fcdn.elephant-world.com%2Fwp-content%2Fuploads%2FMale_African_Elephant_With_Curved_Tusks_600.jpg%5C%22%20width%3D%5C%22600%5C%22%20height%3D%5C%22474%5C%22%2F%3E%3C%2Fp%3E%22%2C%22answers%22%3A%5B%7B%22choice%22%3A%22African%20elephant%22%2C%22isCorrect%22%3Atrue%7D%2C%7B%22choice%22%3A%22Asian%20elephant%22%7D%5D%7D%5D%7D&instance_id=1'
  ],
  [
    'Video',
    'http://localhost:3000/api/activityType/ac-video?config=%7B%22url%22%3A%22https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D6YAHzyRRY8Q%22%2C%22playing%22%3Atrue%7D&instance_id=1&userid=330&username=Petrovsky'
  ],
  [
    'Image gallery',
    'http://localhost:3000/api/activityType/ac-image?config=%7B%22canUpload%22%3Atrue%2C%22acceptAnyFiles%22%3Afalse%2C%22canComment%22%3Atrue%7D&instance_id=1'
  ],
  ['Choose activity', 'http://localhost:3000/api/chooseActivity'],
  ['List of activityTypes (API)', 'http://localhost:3000/api/activityTypes'],
  ['Configure quiz', 'http://localhost:3000/api/config/ac-quiz']
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
      if ((e.data && e.data.type === 'frog-log') || e.data.type === 'h5p-log') {
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
      if (e.data && e.data.type === 'frog-data') {
        this.setState({ data: e.data.msg });
      }
    });
  };
  render() {
    return (
      <div className="App">
        <h1 className="App-title">FROG API test bed</h1>
        Examples:{' '}
        {srcs.map(([title, x], i) => (
          <span>
            <a
              href="#"
              onClick={e => {
                e.preventDefault();
                this.setState({
                  example: i,
                  url: undefined,
                  valid: undefined,
                  errors: i < 4 ? undefined : [],
                  config: undefined,
                  logs: [],
                  activityType: undefined,
                  data: undefined
                });
              }}
            >
              {title}
            </a>
            {'      '}
          </span>
        ))}
        <div style={{ display: 'flex', marginTop: '20px' }}>
          <div>
            <i>
              URL:{' '}
              {(this.state.url || srcs[this.state.example][1] || '').slice(
                0,
                100
              )}...
            </i>
            <br />
            <iframe
              src={this.state.url || srcs[this.state.example][1]}
              width="600px"
              height="700px"
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
                    )}&userid=330&username=Petrovsky`}
                    onClick={e => {
                      e.preventDefault();
                      this.setState({
                        errors: undefined,
                        url: `http://localhost:3000/api/activityType/${
                          this.state.aT
                        }?config=${encodeURIComponent(
                          JSON.stringify(this.state.config)
                        )}&userid=330&username=Petrovsky`
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
                {this.state.data && <h3>Data</h3>}
                <pre> {Stringify(this.state.data)}</pre>
                <h3>Logs</h3>
                <div
                  style={{
                    overflowY: 'scroll',
                    height: '440px',
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
