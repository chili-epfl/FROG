import React, { Component } from 'react';
import PDFJS from 'pdfjs-dist';
import Page from './Page'
import AnnotationLayer from './AnnotationLayer'

export default class PDF extends Component {
  constructor (props) {
    super(props);

    this.onNextPage = this.onNextPage.bind(this)
    this.onPrevPage = this.onPrevPage.bind(this)

    this.state = {
      pdf: null,
      pageNumber: 1,
      scale: 1
    }
  }

  componentDidMount () {
    PDFJS.getDocument(this.props.src).then((pdf) => {
      // console.log(pdf)
      this.setState({ pdf })
    })
  }

  onNextPage() {
    const { pageNumber, pdf } = this.state;
    if (pageNumber >= pdf.numPages) return;

    this.setState({
      pageNumber: pageNumber+1
    })
  }

  onPrevPage() {
    const { pageNumber } = this.state;
    if (pageNumber <= 1) return;

    this.setState({
      pageNumber: pageNumber-1
    })
  }

  render () {
    if (!this.state.pdf) return null;


    const pdf = this.state.pdf;
    const numPages = pdf.pdfInfo.numPages;
    const fingerprint = pdf.pdfInfo.fingerprint;
    const pages = Array(numPages).fill(null).map((v, i) =>
      (<Page pdf={pdf} scale={this.state.scale} index={i + 1} key={`${fingerprint}-${i}`}/>)
    )

    const page = (
      <Page pdf={pdf} scale={this.state.scale} index={this.state.pageNumber} key={`${fingerprint}-${this.state.pageNumber}`}/>
    )


    return (
      <div className='pdf-viewer'>
        {/* <button onClick={this.onPrevPage}>Prev</button>
        <button onClick={this.onNextPage}>Next</button>
        {page} */}

        {/* {pages} */}

        <AnnotationLayer pdf={pdf}/>
      </div>
    )
  }
}
