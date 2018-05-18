// @flow

import * as React from 'react';

class ErrorWrapper extends React.Component<
  { children: any },
  { error: any, retries: number }
> {
  state = { retries: 0, error: null };

  componentDidCatch(error: any) {
    this.setState(prevState => ({
      retries: prevState.retries + 1,
      error
    }));
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
      <h1>Preview failed, try reloading, or opening in another tab</h1>
    ) : (
      children
    );
  }
}

export default ErrorWrapper;
