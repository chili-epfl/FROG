import * as React from 'react';

const withTimer = (WrappedComponent, total, callbackFn) =>
  class extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        secondsRemaining: total
      };
    }

    startTimer = () => {
      this.callback = setInterval(() => {
        callbackFn();
      }, this.state.secondsRemaining * 1000);

      this.interval = setInterval(this.tick, 1000);
    };

    pauseTimer = () => {
      clearTimeout(this.callback);
      clearInterval(this.interval);
    };

    tick = () => {
      this.setState({ secondsRemaining: this.state.secondsRemaining - 1 });
      if (this.state.secondsRemaining <= 0) {
        clearInterval(this.interval);
        clearTimeout(this.callback);
      }
    };

    componentWillUnmount() {
      clearInterval(this.interval);
      clearTimeout(this.callback);
    }

    render() {
      return (
        <WrappedComponent
          ticker={this.state.secondsRemaining}
          startTimer={this.startTimer}
          pauseTimer={this.pauseTimer}
          {...this.props}
        />
      );
    }
  };

export default withTimer;
