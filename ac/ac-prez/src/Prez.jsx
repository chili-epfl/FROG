// @flow

import React, { Component } from 'react';

import { type ActivityRunnerT } from 'frog-utils';

import PDF from './PDF'

// import PDF from 'react-pdf-js';

// import { Document, Page } from 'react-pdf/build/entry.noworker';

export default class Prez extends Component<ActivityRunnerT> {
  node: any;

  constructor() {
    super();

  }

  render() {
    // console.log('rendering Prez.jsx', this.props.data);
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    // const PDF_FILE = "http://unec.edu.az/application/uploads/2014/12/pdf-sample.pdf"
    const PDF_FILE = "http://localhost:3000/file?name=cjgvboit400033i6izhcbvkmx"

    // console.log(PDF_FILE);

    // console.log(activityData, data, dataFn, userInfo, logger)

    return (
      <div>
        <PDF src={PDF_FILE} userInfo={userInfo} data={this.props.data} dataFn={dataFn}/>
      </div>
    )
  }
}
