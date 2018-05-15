import React, { Component } from 'react';
import uuid from 'uuid'
import createStoreAdapter from './StoreAdapter'

export default class AnnotalstionLayer extends Component {
  constructor (props) {
    super();
    console.log(props.pdf);

    this.enableDisablePen = this.enableDisablePen.bind(this);
    this.clearAnnotations = this.clearAnnotations.bind(this);
    this.getAnnotations = this.getAnnotations.bind(this);

    const that = this;

    const PDFJSAnnotate = require('pdf-annotate').default;
    
    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
      getAnnotations(documentId, pageNumber) {
        let annotations = that.getAnnotations()
        annotations = annotations.filter((a) => a.page == pageNumber);
        // console.log('getAnnotations:', annotations);
        return new Promise((resolve, reject) => {
          resolve({
            documentId,
            pageNumber,
            annotations
          })
        })
      },
  
      getAnnotation(documentId, annotationId) {
        console.log('getAnnotation')
        const annotations = that.getAnnotations();
        const annotation = annotations.filter((a) => a.uuid === annotationId)[0]
        return Promise.resolve(annotation);
      },
  
      addAnnotation(documentId, pageNumber, annotation) {
        localStorage.removeItem('savedAnnotations');
        return new Promise((resolve, reject) => {
          annotation.class = 'Annotation';
          annotation.uuid = uuid();
          annotation.page = pageNumber;
          props.dataFn.listAppend(annotation, ['annotations']);
          resolve(annotation);
        });
      },
  
      editAnnotation(documentId, pageNumber, annotation) {/* ... */},
  
      deleteAnnotation(documentId, annotationId) {/* ... */},
  
      addComment(documentId, annotationId, content) {/* ... */},
  
      deleteComment(documentId, commentId) {/* ... */},

      getComments(documentId, annotationId) {
        return new Promise((resolve, reject) => {
          resolve([]);
        });
      }
    });


    // PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter())
    PDFJSAnnotate.setStoreAdapter(StoreAdapter)
    // console.log(PDFJSAnnotate)

    // PDFJSAnnotate.UI.setPen(1, '#000000');

    this.state = {
      PDFJSAnnotate,
      penActive: false,
      rectActive: false,
      studentPaging: false,
      queuedRender: false
    }

  }

  componentDidMount() {
    this.forceReRender();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.state.rendering) {
      if (!prevState.rendering || this.state.queuedRender) return; 
      this.setState({ queuedRender: true });
    }
    else if ((!prevState.rendering) || (this.state.queuedRender)) {
      this.forceReRender();
      this.setState({ rendering: true, queuedRender: false })
    }
  }

  getAnnotations() {
    return this.props.data.annotations;
  }

  enableDisableHighlight() {
    const UI = this.state.PDFJSAnnotate.UI;
    console.log(UI)

    if (this.state.rectActive) {
      UI.disableRect();
    }
    else {
      UI.enableRect('highlight');
    }
    this.setState({
      rectActive: !this.state.rectActive,
    });
  }

  enableDisablePen() {
    const UI = this.state.PDFJSAnnotate.UI;
    console.log(UI)

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
    localStorage.removeItem('savedAnnotations');
    this.props.dataFn.objSet([], 'annotations');
  }

  forceReRender() {
    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: 1,
      rotate: 0
    };

    const shownPageNum = (this.state.studentPaging) ? this.state.pageNumStudent : this.props.data.pageNum;

    var that = this;
    const UI = this.state.PDFJSAnnotate.UI;
    UI.renderPage(shownPageNum, RENDER_OPTIONS).then((result) => {
      // console.log('RENDER RESULT page:', result[0]);
      // console.log('RENDER RESULT annotations:', result[1]);
      that.setState({rendering: false});
    }, (err) => {
      console.error('ERROR RENDERING PAGE:\n', err)
    });
  }

  forceReUpdate() {
    this.forceUpdate();
  }

  nextPageAdmin() {
    if (this.props.data.pageNum+1 > this.props.pdf.numPages) return;
    this.props.dataFn.numIncr(1, ['pageNum']);
  }
  
  prevPageAdmin() {
    if (this.props.data.pageNum <= 1) return;
    this.props.dataFn.numIncr(-1, ['pageNum']);
  }

  nextPageStudent() {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent+1 > this.props.pdf.numPages) return;
      this.setState({
        pageNumStudent: this.state.pageNumStudent+1
      })
    }
    else {
      if (this.props.data.pageNum+1 > this.props.pdf.numPages) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum+1
      })
    }
  }
  
  prevPageStudent() {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent <= 1) return;
      this.setState({
        pageNumStudent: this.state.pageNumStudent-1
      })
    }
    else {
      if (this.props.data.pageNum <= 1) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum-1
      })
    }
  }

  goBackToAdminPaging() {
    this.setState({
      studentPaging: false
    })
  }

  undo() {
    if (this.props.data.annotations.length==0) return;
    const index = this.props.data.annotations.length-1;
    const annotation = this.props.data.annotations[index];

    var savedAnnotations = JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    savedAnnotations.push(annotation);
    localStorage.setItem('savedAnnotations', JSON.stringify(savedAnnotations));

    this.props.dataFn.listDel(null, ['annotations', index.toString()]);
  }

  redo() {
    var savedAnnotations = JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    if (savedAnnotations.length==0) return;

    const annotation = savedAnnotations[savedAnnotations.length-1];
    localStorage.setItem('savedAnnotations', JSON.stringify(savedAnnotations.slice(0, -1)));
    this.props.dataFn.listAppend(annotation, ['annotations']);
  }


  render() {
    // console.log('Rendering AnnotationLayer:', this.props.data)
    const UI = this.state.PDFJSAnnotate.UI;

    const shownPageNum = (this.state.studentPaging) ? this.state.pageNumStudent : this.props.data.pageNum;

    const test = UI.createPage(shownPageNum);
    const svgStyle = test.querySelector('svg').style;
    svgStyle.position = 'absolute';
    svgStyle.top = '0';
    svgStyle.left = '0';

    // const textLayerStyle = test.querySelector('.textLayer').style;
    // textLayerStyle.position = 'absolute';
    // textLayerStyle.top = '0';
    // textLayerStyle.left = '0';

    const testStyle = {
      position: 'relative',
    }


    const penText = (this.state.penActive) ? 'Disable Pen' : 'Enable Pen';
    const rectText = (this.state.rectActive) ? 'Disable Highlight' : 'Enable Highlight';
    const pagingText = (this.state.studentPaging) ? 'Student' : 'Admin'
    // console.log(test.innerHTML);

    const divIDTest = 'pageContainer'+shownPageNum;
    

    return (
      <div>
        <span>Debugging: </span>
        <button onClick={this.forceReRender.bind(this)}>Force Re-Render</button>
        <button onClick={this.forceReUpdate.bind(this)}>Force Re-Update</button>
        <hr></hr>
        <span>Teacher/Admin: </span>
        <button onClick={this.enableDisablePen}>{penText}</button>
        <button onClick={this.enableDisableHighlight.bind(this)}>{rectText}</button>
        <button onClick={this.undo.bind(this)}>UNDO</button>
        <button onClick={this.redo.bind(this)}>REDO</button>
        <button onClick={this.clearAnnotations}>Clear Annotations</button>
        <button onClick={this.prevPageAdmin.bind(this)}>Prev Page</button>
        <button onClick={this.nextPageAdmin.bind(this)}>Next Page</button>
        <hr></hr>
        <span>Student: </span>
        <button onClick={this.prevPageStudent.bind(this)}>Prev Page</button>
        <button onClick={this.nextPageStudent.bind(this)}>Next Page</button>
        <button onClick={this.goBackToAdminPaging.bind(this)}>Back To Teacher</button>
        <hr></hr>
        <span>Page Num: {shownPageNum}/{this.props.pdf.numPages}, Paging: {pagingText}</span>
        <div id={divIDTest} style={testStyle} dangerouslySetInnerHTML={{__html: test.innerHTML}} />
      </div>

    )
  }
}
