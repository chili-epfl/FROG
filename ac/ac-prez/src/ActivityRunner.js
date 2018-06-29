// @flow

import React, { Component } from 'react';
import { type ActivityRunnerPropsT } from 'frog-utils';
import PDF from './PDF';

class Prez extends Component<ActivityRunnerPropsT> {
  node: any;
  pdfFileInput: any = null;

  updateFile = () => {
    localStorage.removeItem('savedAnnotations');
    this.props.dataFn.objSet(1, ['pageNum']);
    this.props.dataFn.objSet([], ['annotations']);
    this.props.dataFn.objSet(this.pdfFileInput.value, ['pdf_file']);
  };

  render() {
    const { activityData, data, dataFn, userInfo } = this.props;

    const hostname = window.location.hostname;
    let initialPDF =
      hostname === 'localhost'
        ? 'http://localhost:3000/file?name=ac/ac-prez/sample.pdf'
        : hostname + '/file?name=ac/ac-prez/sample.pdf';

    if (activityData.config.pdf_url) {
      initialPDF = activityData.config.pdf_url;
    }

    const pdfSRC = this.props.data.pdf_file
      ? this.props.data.pdf_file
      : initialPDF;

    const inputItem = !activityData.config.debug ? null : (
      <span>
        <input
          defaultValue={initialPDF}
          type="text"
          ref={input => (this.pdfFileInput = input)}
        />
        <button onClick={this.updateFile}>Update PDF</button>
        <hr />
      </span>
    );

    return (
      <div style={{ height: '100%' }}>
        {inputItem}
        <PDF
          src={pdfSRC}
          userInfo={userInfo}
          activityData={activityData}
          data={data}
          dataFn={dataFn}
        />
      </div>
    );
  }
}

export default Prez;
