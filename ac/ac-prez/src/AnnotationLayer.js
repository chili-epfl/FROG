import React, { Component } from 'react';
import uuid from 'uuid';

import constants from './constants.js';

class AnnotationLayer extends Component {
  constructor(props) {
    super();

    const PDFJSAnnotate = require('pdf-annotate').default;
    const that = this;
    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
      getAnnotations(documentId, pageNumber) {
        let annotations = that.getAnnotations();
        annotations = annotations.filter(a => a.page === pageNumber);
        return Promise.resolve({
          documentId,
          pageNumber,
          annotations
        });
      },

      getAnnotation(documentId, annotationId) {
        const annotations = that.getAnnotations();
        const annotation = annotations.filter(a => a.uuid === annotationId)[0];
        return Promise.resolve(annotation);
      },

      addAnnotation(documentId, pageNumber, annotation) {
        localStorage.removeItem('savedAnnotations');
        annotation.class = 'Annotation';
        annotation.uuid = uuid();
        annotation.page = pageNumber;
        props.dataFn.listAppend(annotation, ['annotations']);
        return Promise.resolve(annotation);
      },

      editAnnotation(documentId, pageNumber, annotation) {
        const annotations = that.getAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotation.uuid);

        return new Promise((resolve, reject) => {
          if (index == null) reject(new Error('Could not find annotation!'));
          else {
            props.dataFn.objSet(annotation, ['annotations', index.toString()]);
            resolve(annotation);
          }
        });
      },

      deleteAnnotation(documentId, annotationId) {
        const annotations = that.getAnnotations();
        const index = annotations.findIndex(x => x.id === annotationId);

        return new Promise((resolve, reject) => {
          if (index == null) reject(new Error('Could not find annotation!'));
          else {
            props.dataFn.listDel(null, ['annotations', index]);
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

      getComments(documentId, annotationId) {
        return Promise.resolve([documentId, annotationId]);
      }
    });

    PDFJSAnnotate.setStoreAdapter(StoreAdapter);

    PDFJSAnnotate.UI.enableEdit();

    this.state = {
      studentPaging: false,
      activeItem: 'cursor',
      penSize: 1,
      penColor: '#000000'
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
    this.rendering = false;
    this.queuedRender = false;
    this.editorRender = false;
  }

  componentDidMount() {
    this.forceRenderPage();
  }

  shouldComponentUpdate = (nextProps, nextState) =>
    !this.queuedRender &&
    (!nextState.studentPaging ||
      this.state.pageNumStudent !== nextState.pageNumStudent);

  componentDidUpdate() {
    if (this.checkIfTeacher() && !this.editorRender) return;

    this.editorRender = false;

    if (this.rendering) {
      if (!this.queuedRender) {
        this.queuedRender = true;
        setTimeout(this.queueUpRender, 1000);
      }
      return;
    }

    this.forceRenderPage();
  }

  queueUpRender = () => {
    if (!this.rendering) {
      this.queuedRender = false;
    } else {
      setTimeout(this.queueUpRender, 500);
    }
  };

  checkIfTeacher = () => {
    const user = this.props.userInfo.name;
    return user === 'teacher';
  };

  getAnnotations = () => this.props.data.annotations;

  setActiveToolbarItem = item => {
    const UI = this.PDFJSAnnotate.UI;
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
  };

  clearAnnotations = () => {
    localStorage.removeItem('savedAnnotations');
    this.props.dataFn.objSet([], 'annotations');
    this.editorRender = true;
  };

  forceRenderPage = () => {
    this.rendering = true;
    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: 1,
      rotate: 0
    };

    const shownPageNum = this.state.studentPaging
      ? this.state.pageNumStudent
      : this.props.data.pageNum;

    const UI = this.PDFJSAnnotate.UI;
    UI.renderPage(shownPageNum, RENDER_OPTIONS).then(
      result => {
        this.rendering = false;
        return result;
      },
      err => {
        this.rendering = false;
        console.error('ERROR RENDERING PAGE:\n', err);
      }
    );
  };

  nextPageAdmin = () => {
    if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
    this.props.dataFn.numIncr(1, ['pageNum']);
    this.editorRender = true;
  };

  prevPageAdmin = () => {
    if (this.props.data.pageNum <= 1) return;
    this.props.dataFn.numIncr(-1, ['pageNum']);
    this.editorRender = true;
  };

  nextPageStudent = () => {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent + 1 > this.props.pdf.numPages) return;
      this.setState(prevstate => ({
        pageNumStudent: prevstate.pageNumStudent + 1
      }));
    } else {
      if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum + 1
      });
    }
  };

  prevPageStudent = () => {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent <= 1) return;
      this.setState(prevstate => ({
        pageNumStudent: prevstate.pageNumStudent - 1
      }));
    } else {
      if (this.props.data.pageNum <= 1) return;
      this.setState({
        studentPaging: true,
        pageNumStudent: this.props.data.pageNum - 1
      });
    }
  };

  goBackToAdminPaging = () => {
    this.setState({ studentPaging: false });
  };

  checkIfSamePageNum = pageNum =>
    (this.state.studentPaging && this.state.pageNumStudent === pageNum) ||
    (!this.state.studentPaging && this.props.data.pageNum === pageNum);

  undo = () => {
    if (this.props.data.annotations.length === 0) return;
    const index = this.props.data.annotations.length - 1;
    const annotation = this.props.data.annotations[index];

    if (!this.checkIfSamePageNum(annotation.page)) return;

    const savedAnnotations =
      JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    savedAnnotations.push(annotation);
    localStorage.setItem('savedAnnotations', JSON.stringify(savedAnnotations));

    this.props.dataFn.listDel(null, ['annotations', index.toString()]);
    this.editorRender = true;
  };

  redo = () => {
    const savedAnnotations =
      JSON.parse(localStorage.getItem('savedAnnotations')) || [];
    if (savedAnnotations.length === 0) return;
    const annotation = savedAnnotations[savedAnnotations.length - 1];

    if (!this.checkIfSamePageNum(annotation.page)) return;

    localStorage.setItem(
      'savedAnnotations',
      JSON.stringify(savedAnnotations.slice(0, -1))
    );
    this.props.dataFn.listAppend(annotation, ['annotations']);
    this.editorRender = true;
  };

  selectPenSize = e => {
    const size = e.target.value;
    const UI = this.PDFJSAnnotate.UI;
    UI.setPen(size, this.state.penColor);
    this.setState({ penSize: size });
  };

  selectPenColor = e => {
    const color = e.target.value;
    const UI = this.PDFJSAnnotate.UI;
    UI.setPen(this.state.penSize, color);
    this.setState({ penColor: color });
  };

  render() {
    const { activityData } = this.props;

    const UI = this.PDFJSAnnotate.UI;

    const shownPageNum = this.state.studentPaging
      ? this.state.pageNumStudent
      : this.props.data.pageNum;

    const test = UI.createPage(shownPageNum);
    const svgStyle = test.querySelector('svg').style;
    svgStyle.position = 'absolute';
    svgStyle.top = '0';
    svgStyle.left = '0';

    const testStyle = {
      position: 'relative'
    };

    const pagingText = this.state.studentPaging ? 'Student' : 'Admin';

    const divIDTest = 'pageContainer' + shownPageNum;
    const activeToolTipStyle = {
      border: '2px solid lightblue',
      borderRadius: '2px'
    };

    const annotateItems = constants.toolbarItems.map(item => {
      if (this.state.activeItem === item)
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

    const sizeOptions = constants.sizeOptions.map(size => (
      <option key={'penSize' + size} value={size}>
        {' '}
        {size}
      </option>
    ));

    const penSizeItem = (
      <select
        key="penSize"
        value={this.state.penSize}
        onChange={this.selectPenSize}
      >
        {sizeOptions}
      </select>
    );

    const colorOptions = constants.colorOptions.map(colorOption => {
      const color = colorOption[0];
      const text = colorOption[1];
      const style = {
        background: color
      };
      return (
        <option key={'penColor' + color} value={color} style={style}>
          {text}
        </option>
      );
    });

    const penColorItem = (
      <select
        key="penColor"
        value={this.state.penColor}
        onChange={this.selectPenColor}
      >
        {colorOptions}
      </select>
    );

    annotateItems.splice(2, 0, penColorItem);
    annotateItems.splice(2, 0, penSizeItem);

    const debugItems = !activityData.config.debug ? null : (
      <span>
        <span>Debugging: </span>
        <button onClick={this.forceRenderPage}>Force Re-Render</button>
        <hr />
      </span>
    );

    const editorItems = !this.checkIfTeacher() ? null : (
      <span>
        <span>Teacher/Admin: </span>
        <button onClick={this.undo}>UNDO</button>
        <button onClick={this.redo}>REDO</button>
        <button onClick={this.clearAnnotations}>Clear Annotations</button>
        <button onClick={this.prevPageAdmin}>Prev Page</button>
        <button onClick={this.nextPageAdmin}>Next Page</button>
        <hr />
        <span>Annotate: </span>
        {annotateItems}
      </span>
    );

    const studentItems = this.checkIfTeacher() ? null : (
      <span>
        <span>Student: </span>
        <button onClick={this.prevPageStudent}>Prev Page</button>
        <button onClick={this.nextPageStudent}>Next Page</button>
        {this.state.studentPaging && (
          <button onClick={this.goBackToAdminPaging}>Back To Teacher</button>
        )}
      </span>
    );

    return (
      <div>
        {debugItems}
        {editorItems}
        {studentItems}
        <hr />
        <span>
          Page Num: {shownPageNum}/{this.props.pdf.numPages}, Paging:{' '}
          {pagingText}
        </span>
        <div
          id={divIDTest}
          style={testStyle}
          dangerouslySetInnerHTML={{ __html: test.innerHTML }} // eslint-disable-line react/no-danger
        />
      </div>
    );
  }
}

export default AnnotationLayer;
