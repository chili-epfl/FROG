// @flow

import React, { Component } from 'react';

import { type ActivityRunnerT } from 'frog-utils';

import PDF from './PDF';

// import PDF from 'react-pdf-js';

// import { Document, Page } from 'react-pdf/build/entry.noworker';

export default class Prez extends Component<ActivityRunnerT> {
  node: any;

  constructor() {
    super();
  }

  updateFile() {
    console.log(this.pdf_file_input);
    localStorage.removeItem('savedAnnotations');
    this.props.dataFn.objSet(1, ['pageNum']);
    this.props.dataFn.objSet([], ['annotations']);
    this.props.dataFn.objSet(this.pdf_file_input.value, ['pdf_file']);
  }

  render() {
    // console.log('rendering Prez.jsx', this.props.data);
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    // const PDF_FILE = "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf"
    // const PDF_FILE = "http://localhost:3000/file?name=cjgvboit400033i6izhcbvkmx"

    // console.log(PDF_FILE);

    // console.log(activityData, data, dataFn, userInfo, logger)
    const hostname = window.location.hostname;
    const initial_pdf =
      hostname == 'localhost'
        ? 'http://localhost:3000/file?name=ac/ac-prez/sample.pdf'
        : window.location.hostname + '/file?name=ac/ac-prez/sample.pdf';
    console.log(initial_pdf);

    const pdf_src = this.props.data.pdf_file
      ? this.props.data.pdf_file
      : initial_pdf;

    console.log(pdf_src);

    return (
      <div>
        <input
          defaultValue={initial_pdf}
          type="text"
          ref={input => (this.pdf_file_input = input)}
        />
        <button onClick={this.updateFile.bind(this)}>Update PDF</button>
        <hr />
        <PDF
          src={pdf_src}
          userInfo={userInfo}
          data={this.props.data}
          dataFn={dataFn}
        />
      </div>
    );
  }
}
