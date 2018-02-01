// @flow

// wrap a React component and it will receive a prop called timeNow
// updated every x milliseconds (default 3000)
// for example export default TimedComponent(Clock)

import React, { Component } from 'react';

type PropsT = {
  component: Component<*>,
  interval: number,
  props: Object
};

type StateT = {
  timeNow: any
};

class TimedComponentClass extends Component<PropsT, StateT> {
  compo = this.props.component;

  constructor(props: Object) {
    super(props);
    this.state = {
      timeNow: Date.now()
    };
  }

  _mounted: boolean;
  interval: number;

  componentDidMount() {
    this._mounted = true;

    this.interval = Number(
      setInterval(() => {
        if (this._mounted) {
          this.setState({ timeNow: Date.now() });
        }
      }, this.props.interval || 3000)
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    window.clearInterval(this.interval);
  }

  render() {
    return <compo timeNow={this.state.timeNow} {...this.props.props} />;
  }
}

export default (component: any, interval: number) => (props: Object) => (
  <TimedComponentClass
    component={component}
    interval={interval}
    props={props}
  />
);
