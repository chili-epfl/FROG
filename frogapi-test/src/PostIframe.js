import React, { Component } from 'react';
import post from './post';
import { isEqual } from 'lodash';

let i = 0;

function generateIframeName() {
  return `react-post-iframe-${i++}`;
}

export default class PostIframe extends Component {
  iframeName = generateIframeName();

  componentDidMount() {
    const { src, params } = this.props;
    post({ action: src, target: this.iframeName, params });
  }
  componentDidUpdate(prevProps) {
    const { src, params } = this.props;
    if (
      !isEqual(prevProps.params, params) ||
      prevProps.src !== this.props.src
    ) {
      post({ action: src, target: this.iframeName, params });
    }
  }

  render() {
    const { src, params, ...props } = this.props;
    return <iframe {...props} name={this.iframeName} />;
  }
}
