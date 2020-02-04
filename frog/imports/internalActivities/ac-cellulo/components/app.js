import React, { Component } from 'react';
import Heatmap from './heatmap/heatmap';
import config from '../config_dev';

class App extends Component {
  constructor(props) {
    super(props);

    // create ref for SimpleHeat map component
    this.simpleHeatRef = React.createRef();
    // heatmap defaults
    this.defaultMaxOccurances = 180;
    this.defaultBlurValue = 5;
    this.defaultRadiusValue = 14;

    // component's state
    this.state = {
      x: 0,
      y: 0,
      maxOccurances: this.defaultMaxOccurances,
      blurValue: this.defaultBlurValue,
      radiusValue: this.defaultRadiusValue,
      topgreen: 0,
      leftgreen: 0,
      topred: 0,
      leftred: 0
    };

    this.handleWindowClose = this.handleWindowClose.bind(this);
  }

  onClick = e => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    this.props.func(x, y);

    this.setState({ x, y });
  };

  componentWillMount() {
    console.log('App.componentWillMount() props: ', this.props);
    window.addEventListener('beforeunload', this.handleWindowClose);
  }

  componentWillUnMount() {
    window.removeEventListener('beforeunload', this.handleWindowClose);
  }

  async handleWindowClose(e) {
    e.preventDefault();
    // dispatch a UNAUTH_USER action to invoke Cognito
  }

  render() {
    console.log('App.render() called');

    const { maxOccurances, blurValue, radiusValue } = this.state;

    this.state.topgreen = this.props.data[this.props.data.length - 1][1];
    this.state.leftgreen = this.props.data[this.props.data.length - 1][0];

    return (
      <div className="app">
        <Heatmap
          ref={this.simpleHeatRef}
          width={config.HEATMAP_CANVAS_WIDTH}
          height={config.HEATMAP_CANVAS_HEIGTH}
          maxOccurances={maxOccurances}
          blur={blurValue}
          radius={radiusValue}
          // uncomment to send real data in
          data={this.props.data}
        />

        <img
          onClick={this.onClick}
          src="/clientFiles/ac-cellulo/Graph-Trial-1.svg"
          height="449"
          width="636"
          style={{
            position: 'absolute',
            top: '0px',
            left: '0px',
            opacity: 0.2
          }}
        />

        <img
          src="/clientFiles/ac-cellulo/greenHexagon.svg"
          height="40"
          width="30"
          style={{
            position: 'absolute',
            top: this.state.topgreen + 'px',
            left: this.state.leftgreen + 'px',
            opacity: 0.6
          }}
        />

        <br />
      </div>
    );
  }
}

export default App;
