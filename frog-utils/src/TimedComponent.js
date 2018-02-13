// @flow

// wrap a React component and it will receive a prop called timeNow
// updated every x milliseconds (default 3000)
// for example export default TimedComponent(Clock)

import * as React from 'react';

type PropsT = {
  component: Class<React.Component<*, *>>,
  interval: number,
  props: Object
};

type StateT = {
  timeNow: number
};

class TimedComponentClass extends React.Component<PropsT, StateT> {
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
    const Component = this.props.component;
    return <Component timeNow={this.state.timeNow} {...this.props.props} />;
  }
}

export default (component: Class<React.Component<*>>, interval: number) => (
  props: Object
) => (
  <TimedComponentClass
    component={component}
    interval={interval}
    props={props}
  />
);
