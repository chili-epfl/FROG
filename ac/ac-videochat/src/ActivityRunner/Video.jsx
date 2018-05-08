// @flow

import React from 'react';

class Video extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.videoId !== this.props.videoId ||
      nextProps.mute !== this.props.mute ||
      nextProps.srcObject !== this.props.srcObject
    );
  }

  componentDidMount() {
    this.setSource(this.props.srcObject);
  }

  //when component updates, set up video source
  componentDidUpdate() {
    this.setSource(this.props.srcObject);
  }

  setSource = srcObject => {
    const video = this.videoRef.current;
    video.srcObject = srcObject;
  };

  render() {
    return (
      <video
        ref={this.videoRef}
        playsInline
        id={this.props.videoId}
        autoPlay
        muted={this.props.mute}
        height="100%"
        width="100%"
      />
    );
  }
}

export default Video;
