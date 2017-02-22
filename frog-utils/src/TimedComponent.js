// wrap a React component and it will receive a prop called timeNow
// updated every x milliseconds (default 3000)
// for example export default TimedComponent(Clock)

import React, { Component } from 'react';

class TimedComponentClass extends Component {
  constructor(props) {
    super(props);
    this.state = { timeNow: Date.now() };
  }

  componentDidMount() {
    const interval = setInterval(
      () => this.setState({ timeNow: Date.now() }),
      this.props.interval || 3000
    );
    this.setState({ interval });
  }

  componentWillUnmount() {
    window.clearInterval(this.state.interval);
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

export default (component, interval) =>
  props => (
    <TimedComponentClass
      component={component}
      interval={interval}
      props={props}
    />
  );
