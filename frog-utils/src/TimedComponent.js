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
  timeNow: Date,
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

  shouldComponentUpdate(nextProps: PropsT, nextState: StateT) {
    const { timeNow } = this.state;
    if (nextState.timeNow !== timeNow) return true;
    const {
      props: { activity }
    } = this.props;
    return !(
      activity &&
      nextProps.props.activity &&
      activity._id === nextProps.props.activity._id
    );
  }

  componentDidMount() {
    this._mounted = true;
    const { props, interval } = this.props;
    this.interval = Number(
      setInterval(() => {
        if (this._mounted) {
          this.setState({ timeNow: new Date(), props });
        }
      }, interval || 3000)
    );
  }

  componentWillUnmount() {
    this._mounted = false;
    window.clearInterval(this.interval);
  }

  render() {
    const { component } = this.props;
    const Component = component;
    const { props, timeNow } = this.state;
    return <Component {...props} timeNow={timeNow} />;
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
