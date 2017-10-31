import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
  }
  render() {
    if (this.state.error) {
      return (
        <div
          className="snap"
          onClick={() => Raven.lastEventId() && Raven.showReportDialog()}
        >
          <p>We're sorry — something's gone wrong.</p>
          <p>Our team has been notified, but click here fill out a report.</p>
        </div>
      );
    } else {
      //when there's not an error, render children untouched
      return this.props.children;
    }
  }
}
