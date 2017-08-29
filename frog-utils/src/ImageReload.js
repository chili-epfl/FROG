// @flow
import React from 'react';

class ImageReload extends React.Component {
  state: { src: string, origSrc: string, timeout: any };
  props: { src: string, style?: Object, className?: string };

  constructor(props: { src: string }) {
    super(props);
    this.state = {
      src: this.props.src + '?',
      origSrc: this.props.src,
      timeout: null
    };
  }

  componentWillReceiveProps = (nextProps: { src: string }) => {
    if (nextProps.src !== this.state.origSrc) {
      this.setState({
        src: nextProps.src + '?',
        origSrc: nextProps.src,
        timeout: null
      });
    }
  };

  handleImageLoaded = () => {
    if (this.state.timeout) {
      window.clearTimeout(this.state.timeout);
      this.state.timeout = null;
    }
  };

  handleImageErrored = () => {
    this.setState({ timeout: window.setTimeout(this.tryAgain, 1000) });
  };

  tryAgain = () => {
    this.setState({ src: this.state.src + 'a' });
  };

  componentWillUnmount = () => {
    if (this.state.timeout) {
      window.clearTimeout(this.state.timeout);
    }
  };

  render() {
    return (
      <img
        alt=""
        src={this.state.src}
        style={this.props.style}
        className={this.props.className}
        onLoad={this.handleImageLoaded}
        onError={this.handleImageErrored}
      />
    );
  }
}
export default ImageReload;
