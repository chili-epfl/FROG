import React, { Component } from 'react';

export default class AnnotationLayer extends Component {
  constructor (props) {
    super(props);
    console.log(this.props.pdf);

    this.enableDisablePen = this.enableDisablePen.bind(this);
    this.clearAnnotations = this.clearAnnotations.bind(this);

    const PDFJSAnnotate = require('pdf-annotate').default;
    PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter())
    console.log(PDFJSAnnotate)

    this.state = {
      PDFJSAnnotate,
      penActive: false
    }

  }

  componentDidMount() {
    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: 1,
      rotate: 0
    };

    const UI = this.state.PDFJSAnnotate.UI;
    console.log('hello')
    UI.renderPage(1, RENDER_OPTIONS).then((result, error) => {
      console.log('2')
      console.log(result, error);
    });

    UI.setPen(1, '#000000');
    UI.enableRect('highlight');
  }

  enableDisablePen() {
    const UI = this.state.PDFJSAnnotate.UI;

    if (this.state.penActive) {
      UI.disablePen();
    }
    else {
      UI.enablePen();
    }
    this.setState({
      penActive: !this.state.penActive,
    });
  }

  clearAnnotations() {
    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: 1,
      rotate: 0
    };
    const UI = this.state.PDFJSAnnotate.UI;

    localStorage.removeItem(this.props.pdf.fingerprint + '/annotations');
    UI.renderPage(1, RENDER_OPTIONS).then(this.forceUpdate)
  }


  render() {

    const UI = this.state.PDFJSAnnotate.UI;
    const test = UI.createPage(1)
    const svgStyle = test.querySelector('svg').style;
    svgStyle.position = 'absolute';
    svgStyle.top = '0';
    svgStyle.left = '0';

    const textLayerStyle = test.querySelector('.textLayer').style;
    textLayerStyle.position = 'absolute';
    textLayerStyle.top = '0';
    textLayerStyle.left = '0';


    const testStyle = {
      position: 'relative',
      'svg': {
        position: 'absolute',
        left: 0,
        top: 0,
        'zIndex': 2
      }
    }


    const penText = (this.state.penActive) ? 'Disable Pen' : 'Enable Pen';

    return (
      <div>
        <button onClick={this.enableDisablePen}>{penText}</button>
        <button onClick={this.clearAnnotations}>Clear Annotations</button>
        <div id='pageContainer1' style={testStyle} dangerouslySetInnerHTML={{__html: test.innerHTML}} />
      </div>

    )
  }
}
