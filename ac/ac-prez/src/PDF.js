import React, { Component } from 'react';
import PDFJS from '@houshuang/pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';
import ScratchPad from './ScratchPad';

export default class PDF extends Component {
  state = {
    pdf: null,
    err: null
  };

  componentDidMount() {
    this.getPDF();
  }

  componentDidUpdate(prevProps) {
    if (this.props.src !== prevProps.src) {
      this.getPDF();
    }
  }

  switchMode = () => {
    this.props.dataFn.objSet(!this.props.data.scratchpadMode, [
      'scratchpadMode'
    ]);
  };

  getPDF = () => {
    try {
      const location = window.location;
      const cMapUrl =
        location.protocol +
        '//' +
        location.hostname +
        (location.port ? ':' + location.port : '') +
        '/cmaps/';
      PDFJS.PDFJS.cMapUrl = cMapUrl;
      PDFJS.PDFJS.cMapPacked = true;
      PDFJS.getDocument(this.props.src).then(
        pdf => {
          this.setState({ pdf, err: null });
        },
        err => {
          console.error('ERROR in THEN of getPDF:', err);
          this.setState({ pdf: null, err: err.message });
        }
      );
    } catch (err) {
      console.error('ERROR GET PDF:', err);
      this.setState({ pdf: null, err: err.message });
    }
  };

  checkIfTeacher = () => {
    const user = this.props.userInfo.name;
    return user === 'teacher';
  };

  render() {
    const { activityData, data, dataFn, userInfo } = this.props;

    const { pdf } = this.state;

    let layerDisplay = null;

    if (this.props.data.scratchpadMode) {
      layerDisplay = (
        <ScratchPad
          userInfo={userInfo}
          activityData={activityData}
          data={data}
          dataFn={dataFn}
          switchMode={this.switchMode}
        />
      );
    } else if (this.state.err) {
      layerDisplay = (
        <div>
          <p>Invalid PDF provided!</p>
          <p>Error: {this.state.err}</p>
        </div>
      );
    } else if (pdf) {
      layerDisplay = (
        <AnnotationLayer
          pdf={pdf}
          userInfo={userInfo}
          activityData={activityData}
          data={data}
          dataFn={dataFn}
          switchMode={this.switchMode}
        />
      );
    }

    const stylish = {
      height: '100%'
    };

    return (
      <div style={stylish}>
        <div id="viewer" className="pdf-viewer" style={stylish}>
          {layerDisplay}
        </div>
      </div>
    );
  }
}
