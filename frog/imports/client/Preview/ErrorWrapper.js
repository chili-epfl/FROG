// @flow

import * as React from 'react';
import * as Sentry from '@sentry/browser';

class ErrorWrapper extends React.Component<
  { children: any },
  { error: any, retries: number, eventId: ?string }
> {
  state = { eventId: undefined, retries: 0, error: null };

  componentDidCatch(error: any, errorInfo: any) {
    Sentry.withScope(scope => {
      scope.setExtras(errorInfo);
      const eventId = Sentry.captureException(error);
      this.setState(prevState => ({
        retries: prevState.retries + 1,
        error,
        eventId
      }));
    });
    console.error(
      'Crashed on previewstate, removing and trying again',
      sessionStorage.getItem('previewState')
    );
    sessionStorage.removeItem('previewstate');
  }

  render() {
    const { error, retries } = this.state;
    const { children } = this.props;

    return error && retries > 2 ? (
      <>
        <h1>Preview failed, try reloading, or opening in another tab</h1>
        <button
          onClick={() =>
            Sentry.showReportDialog({ eventId: this.state.eventId })
          }
        >
          Report feedback
        </button>
      </>
    ) : (
      children
    );
  }
}

export default ErrorWrapper;
