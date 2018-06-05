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

  onSwitchMode = () => {
    this.props.dataFn.objSet(!this.props.data.scratchpadMode, [
      'scratchpadMode'
    ]);
  };

  getPDF = () => {
    try {
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
        />
      );
    }

    let annotationsModeItem = null;
    if (this.checkIfTeacher()) {
      annotationsModeItem = !this.props.data.scratchpadMode ? (
        <button onClick={this.onSwitchMode}>Switch to ScrachPad</button>
      ) : (
        <button onClick={this.onSwitchMode}>Switch back to PDF</button>
      );
    }

    return (
      <div>
        {annotationsModeItem}
        <div id="viewer" className="pdf-viewer">
          {layerDisplay}
        </div>
      </div>
    );
  }
}
