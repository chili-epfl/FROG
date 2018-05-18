import React, { Component } from 'react';
import uuid from 'uuid';
import createStoreAdapter from './StoreAdapter';

export default class AnnotalstionLayer extends Component {
  constructor(props) {
    super();
    console.log(props.pdf);

    this.clearAnnotations = this.clearAnnotations.bind(this);
    this.getAnnotations = this.getAnnotations.bind(this);
    this.setActiveToolbarItem = this.setActiveToolbarItem.bind(this);

    this.toolbarItems = [
      'cursor',
      'draw',
      'area',
      'highlight',
      'strikeout' /* , 'text', 'point' */
    ];

    const PDFJSAnnotate = require('pdf-annotate').default;

    const that = this;
    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
      getAnnotations(documentId, pageNumber) {
        let annotations = that.getAnnotations();
        annotations = annotations.filter(a => a.page == pageNumber);
        // console.log('getAnnotations:', annotations);
        return new Promise((resolve, reject) => {
          resolve({
            documentId,
            pageNumber,
            annotations
          });
        });
      },

      getAnnotation(documentId, annotationId) {
        console.log('getAnnotation');
        const annotations = that.getAnnotations();
        const annotation = annotations.filter(a => a.uuid === annotationId)[0];
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

      editAnnotation(documentId, pageNumber, annotation) {
        const annotations = that.getAnnotations();
        let index = null;
        for (let i = 0; i <= annotations.length; i++) {
          if (annotations[i].uuid === annotation.uuid) {
            index = i;
            break;
          }
        }

        return new Promise((resolve, reject) => {
          if (index == null) reject(new Error('Could not find annotation!'));
          else {
            props.dataFn.ObjSet(annotation, ['annotations', index.toString()]);
            resolve(annotation);
          }
        });
      },

      deleteAnnotation(documentId, annotationId) {
        const annotations = that.getAnnotations();
        let index = null;
        for (let i = 0; i <= annotations.length; i++) {
          if (annotations[i].uuid == annotationId) {
            index = i;
            break;
          }
        }

        return new Promise((resolve, reject) => {
          if (index == null) reject(new Error('Could not find annotation!'));
          else {
            props.dataFn.listDel(null, ['annotations', index.toString()]);
            const savedAnnotations =
              JSON.parse(localStorage.getItem('savedAnnotations')) || [];
            savedAnnotations.push(annotations[index]);
            localStorage.setItem(
              'savedAnnotations',
              JSON.stringify(savedAnnotations)
            );
            resolve(true);
          }
        });
      },

      addComment(documentId, annotationId, content) {
        /* ... */
      },

      deleteComment(documentId, commentId) {
        /* ... */
      },

      getComments(documentId, annotationId) {
        return new Promise((resolve, reject) => {
          resolve([]);
        });
      }
    });

    // PDFJSAnnotate.setStoreAdapter(new PDFJSAnnotate.LocalStoreAdapter())
    PDFJSAnnotate.setStoreAdapter(StoreAdapter);
    // console.log(PDFJSAnnotate)

    // PDFJSAnnotate.UI.setPen(1, '#000000');
    PDFJSAnnotate.UI.enableEdit();

    this.state = {
      PDFJSAnnotate,
      studentPaging: false,
      queuedRender: false,
      activeItem: 'cursor',
      renderBool: false
    };
  }

  componentDidMount() {
    this.forceReRender();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // console.log(prevProps);
    // console.log(this.props);
    // console.log(this.checkIfAdmin());

    if (this.checkIfAdmin() && prevState.renderBool == this.state.renderBool)
      return;

    if (this.state.rendering) {
      if (!prevState.rendering || this.state.queuedRender) return;
      this.setState({ queuedRender: true });
    } else if (!prevState.rendering || this.state.queuedRender) {
      this.forceReRender();
      this.setState({ rendering: true, queuedRender: false });
    }
  }

  checkIfAdmin() {
    return this.props.userInfo.name == 'admin';
  }

  getAnnotations() {
    return this.props.data.annotations;
  }

  setActiveToolbarItem(item) {
    console.log(item);
    const UI = this.state.PDFJSAnnotate.UI;
    const activeItem = this.state.activeItem;

    switch (activeItem) {
      case 'cursor':
        UI.disableEdit();
        break;
      case 'draw':
        UI.disablePen();
        break;
      case 'text':
        UI.disableText();
        break;
      case 'point':
        UI.disablePoint();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.disableRect();
        break;
      default:
        console.error('Unrecognized activeItem');
    }

    switch (item) {
      case 'cursor':
        UI.enableEdit();
        break;
      case 'draw':
        UI.enablePen();
        break;
      case 'text':
        UI.enableText();
        break;
      case 'point':
        UI.enablePoint();
        break;
      case 'area':
      case 'highlight':
      case 'strikeout':
        UI.enableRect(item);
        break;
      default:
        console.error('Unrecognized new item');
    }

    this.setState({ activeItem: item });
  }

  clearAnnotations() {
    localStorage.removeItem('savedAnnotations');
    this.props.dataFn.objSet([], 'annotations');
    this.setState({ renderBool: !this.state.renderBool });
  }

  forceReRender() {
    // console.log('RENDERING PAGE');

    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: 1,
      rotate: 0
    };

    const shownPageNum = this.state.studentPaging
      ? this.state.pageNumStudent
      : this.props.data.pageNum;

    const that = this;
    const UI = this.state.PDFJSAnnotate.UI;
    UI.renderPage(shownPageNum, RENDER_OPTIONS).then(
      result => {
        // console.log('RENDER RESULT page:', result[0]);
        // console.log('RENDER RESULT annotations:', result[1]);
        that.setState({ rendering: false });
      },
      err => {
        console.error('ERROR RENDERING PAGE:\n', err);
      }
    );
  }

  forceReUpdate() {
    this.forceUpdate();
  }

  nextPageAdmin() {
    if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
    this.props.dataFn.numIncr(1, ['pageNum']);
    this.setState({ renderBool: !this.state.renderBool });
  }

  prevPageAdmin() {
    if (this.props.data.pageNum <= 1) return;
    this.props.dataFn.numIncr(-1, ['pageNum']);
    this.setState({ renderBool: !this.state.renderBool });
  }

  nextPageStudent() {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent + 1 > this.props.pdf.numPages) return;
      this.setState({
        pageNumStudent: this.state.pageNumStudent + 1
      });
    } else {
      if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum + 1
      });
    }
  }

  prevPageStudent() {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent <= 1) return;
      this.setState({
        pageNumStudent: this.state.pageNumStudent - 1
      });
    } else {
      if (this.props.data.pageNum <= 1) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum - 1
      });
    }
  }

  goBackToAdminPaging() {
    this.setState({ studentPaging: false });
  }

  undo() {
    if (this.props.data.annotations.length == 0) return;
    const index = this.props.data.annotations.length - 1;
    const annotation = this.props.data.annotations[index];

    const savedAnnotations =
      JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    savedAnnotations.push(annotation);
    localStorage.setItem('savedAnnotations', JSON.stringify(savedAnnotations));

    this.props.dataFn.listDel(null, ['annotations', index.toString()]);
    this.setState({ renderBool: !this.state.renderBool });
  }

  redo() {
    const savedAnnotations =
      JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    if (savedAnnotations.length == 0) return;

    const annotation = savedAnnotations[savedAnnotations.length - 1];
    localStorage.setItem(
      'savedAnnotations',
      JSON.stringify(savedAnnotations.slice(0, -1))
    );
    this.props.dataFn.listAppend(annotation, ['annotations']);
    this.setState({ renderBool: !this.state.renderBool });
  }

  render() {
    // console.log('RENDERING')
    const { activityData, data, dataFn, userInfo, logger } = this.props;

    const UI = this.state.PDFJSAnnotate.UI;

    const shownPageNum = this.state.studentPaging
      ? this.state.pageNumStudent
      : this.props.data.pageNum;

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
      position: 'relative'
    };

    const penText = this.state.penActive ? 'Disable Pen' : 'Enable Pen';
    const rectText = this.state.rectActive
      ? 'Disable Highlight'
      : 'Enable Highlight';
    const pagingText = this.state.studentPaging ? 'Student' : 'Admin';
    // console.log(test.innerHTML);

    const divIDTest = 'pageContainer' + shownPageNum;
    const activeToolTipStyle = {
      border: '2px solid lightblue',
      borderRadius: '2px'
    };
    const items = this.toolbarItems.map(item => {
      if (this.state.activeItem == item)
        return (
          <button
            key={item}
            style={activeToolTipStyle}
            className="activeTooltip"
            onClick={() => this.setActiveToolbarItem(item)}
          >
            {item}
          </button>
        );

      return (
        <button key={item} onClick={() => this.setActiveToolbarItem(item)}>
          {item}
        </button>
      );
    });

    const debugItem = !activityData.config.debug ? null : (
      <span>
        <span>Debugging: </span>
        <button onClick={this.forceReRender.bind(this)}>Force Re-Render</button>
        <button onClick={this.forceReUpdate.bind(this)}>Force Re-Update</button>
        <hr />
      </span>
    );

    return (
      <div>
        {debugItem}
        <span>Teacher/Admin: </span>
        <button onClick={this.undo.bind(this)}>UNDO</button>
        <button onClick={this.redo.bind(this)}>REDO</button>
        <button onClick={this.clearAnnotations}>Clear Annotations</button>
        <button onClick={this.prevPageAdmin.bind(this)}>Prev Page</button>
        <button onClick={this.nextPageAdmin.bind(this)}>Next Page</button>
        <hr />
        <span>Student: </span>
        <button onClick={this.prevPageStudent.bind(this)}>Prev Page</button>
        <button onClick={this.nextPageStudent.bind(this)}>Next Page</button>
        <button onClick={this.goBackToAdminPaging.bind(this)}>
          Back To Teacher
        </button>
        <hr />
        <span>Annotate: </span>
        {items}
        <hr />
        <span>
          Page Num: {shownPageNum}/{this.props.pdf.numPages}, Paging:{' '}
          {pagingText}
        </span>
        <div
          id={divIDTest}
          style={testStyle}
          dangerouslySetInnerHTML={{ __html: test.innerHTML }}
        />
      </div>
    );
  }
}
