import React, { Component } from 'react';
import PDFJS from '@houshuang/pdfjs-dist';
import AnnotationLayer from './AnnotationLayer';

export default class PDF extends Component {
  constructor(props) {
    super(props);

    this.getPDF = this.getPDF.bind(this);

    this.state = {
      pdf: null,
      pageNumber: 1,
      scale: 1,
      err: null
    };
  }

  componentDidMount() {
    this.getPDF();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.props, prevProps);
    // console.log(this.state, prevState);
    if (this.props.src != prevProps.src) {
      this.getPDF();
    }
  }

  getPDF() {
    try {
      PDFJS.getDocument(this.props.src).then(
        pdf => {
          console.log(pdf);
          this.setState({ pdf, err: null });
        },
        err => {
          console.log('ERROR in THEN');
          this.setState({ pdf: null, err: err.message });
        }
      );
    } catch (err) {
      console.error('ERROR GET PDF:', err);
      this.setState({ pdf: null, err: err.message });
    }
  }

  render() {
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    const pdf = this.state.pdf;
    // const numPages = pdf.pdfInfo.numPages;
    // const fingerprint = pdf.pdfInfo.fingerprint;

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
