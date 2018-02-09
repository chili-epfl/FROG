// @flow
import * as React from 'react';

type propsT = { src: string, style?: Object, className?: string };

class ImageReload extends React.Component<
  propsT,
  { src: string, origSrc: string, timeout: any, counter: number }
> {
  constructor(props: propsT) {
    super(props);
    this.state = {
      src: this.props.src + '?',
      origSrc: this.props.src,
      counter: 1,
      timeout: null
    };
  }

  componentWillReceiveProps = (nextProps: propsT) => {
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
    if (this.state.counter < 5) {
      this.setState({
        timeout: window.setTimeout(this.tryAgain, this.state.counter * 1000)
      });
    } else if (this.state.timeout) {
      window.clearTimeout(this.state.timeout);
    }
  };

  tryAgain = () => {
    this.setState({
      src: this.state.src + 'a',
      counter: this.state.counter + 1
    });
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
