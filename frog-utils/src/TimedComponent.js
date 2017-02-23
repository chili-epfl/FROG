// @flow

// wrap a React component and it will receive a prop called timeNow
// updated every x milliseconds (default 3000)
// for example export default TimedComponent(Clock)

import React, { Component } from 'react';

class TimedComponentClass extends Component {
  state: {
    timeNow: any
  };

  constructor(props: { component: any, interval: number, props: Object }) { // eslint-disable-line
    super(props);
    this.state = {
      timeNow: Date.now()
    };
  }

  _mounted: boolean;
  interval: number;

  componentDidMount() {
    this._mounted = true;

    this.interval = setInterval(
      () => {
        if (this._mounted) {
          this.setState({ timeNow: Date.now() });
        }
      },
      this.props.interval || 3000
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    window.clearInterval(this.interval);
  }

  render() {
    return (
      <this.props.component
        timeNow={this.state.timeNow}
        {...this.props.props}
      />
    );
  }
}

export default (component: any, interval: number) =>
  (props: Object) => (
    <TimedComponentClass
      component={component}
      interval={interval}
      props={props}
    />
  );
