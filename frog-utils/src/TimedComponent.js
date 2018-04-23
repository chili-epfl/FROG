// @flow

// wrap a React component and it will receive a prop called timeNow
// updated every x milliseconds (default 3000)
// for example export default TimedComponent(Clock)

import * as React from 'react';

type PropsT = {
  component: React.ComponentType<*>,
  interval: number,
  props: Object
};

type StateT = {
  timeNow: number,
  props: Object
};

class TimedComponentClass extends React.Component<PropsT, StateT> {
  constructor(props: Object) {
    super(props);
    this.state = {
      timeNow: new Date(),
      props: props.props
    };
  }

  _mounted: boolean;
  interval: number;

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.timeNow !== this.state.timeNow) {
      return true;
    }
    return !(
      this.props.props.activity &&
      nextProps.props.activity &&
      this.props.props.activity._id === nextProps.props.activity._id
    );
  }

  componentDidMount() {
    this._mounted = true;

    this.interval = Number(
      setInterval(() => {
        if (this._mounted) {
          this.setState({ timeNow: new Date(), props: this.props.props });
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
    return (
      <Component {...this.state.props} timeNow={this.state.timeNow} />
    )
  }
}

export default (component: React.ComponentType<*>, interval: number) => (
  props: Object
) => (
  <TimedComponentClass
    component={component}
    interval={interval}
    props={props}
  />
);
