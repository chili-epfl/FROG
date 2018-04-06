// @flow

import React, { Component } from 'react';

import { type ActivityRunnerT } from 'frog-utils';

import PDF from './PDF'

// import PDF from 'react-pdf-js';

// import { Document, Page } from 'react-pdf/build/entry.noworker';

// import PDFJSworker from 'pdfjs-dist/build/pdf.worker';

export default class Prez extends Component<ActivityRunnerT> {
  node: any;

  constructor() {
    super();

    this.state = {
      numPages: null,
      pageNumber: 1
    }
  }

  render() {
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    const PDF_FILE = "test.pdf"

    console.log(PDF_FILE);

    return (
      <div>
        {/* {JSON.stringify(activityData)} */}
        <PDF src={PDF_FILE} />
      </div>
    )
  }
}
