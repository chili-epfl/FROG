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
    const { activityData, data, dataFn, userInfo, logger } = this.props;
    // console.log(activityData);
    // console.log(activityData, data, dataFn, userInfo, logger)

    const hostname = window.location.hostname;
    let initial_pdf =
      hostname == 'localhost'
        ? 'http://localhost:3000/file?name=ac/ac-prez/sample.pdf'
        : hostname + '/file?name=ac/ac-prez/sample.pdf';
    
    if (activityData.config.pdf_url) {
      initial_pdf = activityData.config.pdf_url;
    }
    // console.log(initial_pdf);

    const pdf_src = this.props.data.pdf_file
      ? this.props.data.pdf_file
      : initial_pdf;

    // console.log(pdf_src);

    const inputItem = (!activityData.config.debug) ? null : (
      <span>
        <input
          defaultValue={initial_pdf}
          type="text"
          ref={input => (this.pdf_file_input = input)}
        />
        <button onClick={this.updateFile.bind(this)}>Update PDF</button>
        <hr />
      </span>
    )

    return (
      <div>
        {inputItem}
        <PDF
          src = {pdf_src}
          userInfo = {userInfo}
          activityData = {activityData}
          data = {data}
          dataFn = {dataFn}
        />
      </div>
    );
  }
}
