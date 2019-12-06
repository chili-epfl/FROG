import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
// import PropTypes from 'prop-types';
import Heatmap from './heatmap/heatmap';
import config from '../config_dev';

class App extends Component {
  constructor(props) {
    super(props);

    // create ref for SimpleHeat map component
    this.simpleHeatRef = React.createRef();
    // heatmap defaults
    this.defaultMaxOccurances = 18;
    this.defaultBlurValue = 10;
    this.defaultRadiusValue = 14;

    // component's state
    this.state = {
      data: [], // data array contains a list of sub-arrays with [x, y, occurances] values.  refer to data.js for example.
      maxOccurances: this.defaultMaxOccurances,
      blurValue: this.defaultBlurValue,
      radiusValue: this.defaultRadiusValue
    };

    this.handleWindowClose = this.handleWindowClose.bind(this);
  }

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
          // data={data}
        />
      </div>
    );
  }
}

App.propTypes = {
  // authenticated: PropTypes.bool,
  // history: PropTypes.func
};

export default App;
