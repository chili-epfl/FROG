import React, { Component } from 'react';
import PDFJS from '@houshuang/pdfjs-dist';

import AnnotationLayer from './AnnotationLayer';

export default class PDF extends Component {
  state = {
    pdf: null,
    pageNumber: 1,
    scale: 1,
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

  render() {
    const { activityData, data, dataFn, userInfo } = this.props;

    const { pdf } = this.state;

    let layerDisplay = null;

    if (this.state.err) {
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

    return (
      <div id="viewer" className="pdf-viewer">
        {layerDisplay}
      </div>
    );
  }
}
