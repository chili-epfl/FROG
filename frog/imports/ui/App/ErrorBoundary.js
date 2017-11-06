import React, { Component } from 'react';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  componentDidCatch(error, errorInfo) {
    this.setState({ error });
    try {
      Raven.captureException(error, { extra: errorInfo });
    } catch (e) {} // eslint-disable-line no-empty
  }
  render() {
    if (this.state.error) {
      return <p>{`We're sorry — something's gone wrong.`}</p>;
    } else {
      return this.props.children;
    }
  }
}
