import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  componentDidCatch(error, errorInfo) {
    try {
      Sentry.withScope(scope => {
        scope.setExtras(errorInfo);
        const eventId = Sentry.captureException(error);
        this.setState({ eventId });
      });
    } catch (e) {} // eslint-disable-line no-empty
  }

  render() {
    if (this.state.error) {
      return (
        <>
          Unfortunately, there was an error.
          <button
            onClick={() =>
              Sentry.showReportDialog({ eventId: this.state.eventId })
            }
          >
            Report feedback
          </button>
        </>
      );
    } else {
      return this.props.children;
    }
  }
}
