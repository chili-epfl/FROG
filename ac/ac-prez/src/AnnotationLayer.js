import React, { Component } from 'react';
import uuid from 'uuid';
import Mousetrap from 'mousetrap';
import constants from './constants.js';

class AnnotationLayer extends Component {
  constructor(props) {
    super();

    const PDFJSAnnotate = require('pdf-annotate').default;
    const that = this;
    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
      getAnnotations(documentId, pageNumber) {
        const annotations = that.getPageAnnotations();
        return Promise.resolve({
          documentId,
          pageNumber,
          annotations
        });
      },

      getAnnotation(documentId, annotationId) {
        const annotations = that.getPageAnnotations();
        const annotation = annotations.filter(a => a.uuid === annotationId)[0];
        return Promise.resolve(annotation);
      },

      addAnnotation(documentId, pageNumber, annotation) {
        const currentPageNum = that.getCurrentPageNum();
        const savedAnnotations = that.getSavedAnnotations();
        delete savedAnnotations[currentPageNum];
        that.replaceSavedAnnotations(savedAnnotations);

        annotation.class = 'Annotation';
        annotation.uuid = uuid();
        annotation.page = pageNumber;
        const pageAnnotations = that.getPageAnnotations();
        if (pageAnnotations.length === 0)
          props.dataFn.objInsert([annotation], ['annotations', currentPageNum]);
        else
          props.dataFn.listAppend(annotation, ['annotations', currentPageNum]);
        return Promise.resolve(annotation);
      },

      editAnnotation(documentId, pageNumber, annotation) {
        const currentPageNum = that.getCurrentPageNum();
        const annotations = that.getPageAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotation.uuid);

        return new Promise((resolve, reject) => {
          if (index === -1) reject(new Error('Could not find annotation!'));
          else {
            props.dataFn.objSet(annotation, [
              'annotations',
              currentPageNum,
              index.toString()
            ]);
            resolve(annotation);
          }
        });
      },

      deleteAnnotation(documentId, annotationId) {
        const currentPageNum = that.getCurrentPageNum();
        const annotations = that.getPageAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotationId);

        return new Promise((resolve, reject) => {
          if (index === -1) reject(new Error('Could not find annotation!'));
          else {
            const savedAnnotations = that.getSavedAnnotations();
            if (savedAnnotations[currentPageNum])
              savedAnnotations[currentPageNum].push(annotations[index]);
            else savedAnnotations[currentPageNum] = [annotations[index]];
            that.replaceSavedAnnotations(savedAnnotations);

            props.dataFn.listDel(null, ['annotations', currentPageNum, index]);

            resolve(true);
          }
        });
      },

      getComments(documentId, annotationId) {
        return Promise.resolve([documentId, annotationId]);
      }
    });

    PDFJSAnnotate.setStoreAdapter(StoreAdapter);

    PDFJSAnnotate.UI.disableEdit();
    PDFJSAnnotate.UI.disablePen();
    PDFJSAnnotate.UI.disableText();
    PDFJSAnnotate.UI.disablePoint();
    PDFJSAnnotate.UI.disableRect();
    PDFJSAnnotate.UI.enableEdit();
    PDFJSAnnotate.UI.setPen(1, '#000000');

    this.state = {
      initialLoading: true,
      studentPaging: false,
      activeItem: 'cursor',
      penSize: 1,
      penColor: '#000000'
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
    this.rendering = false;
    this.queuedRender = false;
    this.editorRender = false;
    this.resetPaging = true;
    this.savedScale = 1;
    this.rescaleDone = false;
    this.queuedResize = false;
  }

  componentWillMount() {
    if (!localStorage.getItem('savedAnnotations'))
      this.replaceSavedAnnotations({});
    if (this.resetPaging)
      this.props.dataFn.objSet(this.props.data.pageNum, ['furthestPageNum']);
    Mousetrap.bind('backspace', () => this.undo());
    Mousetrap.bind('left', e => {
      e.preventDefault();
      this.handleLeftArrow();
    });
    Mousetrap.bind('right', e => {
      e.preventDefault();
      this.handleRightArror();
    });
  }

  handleLeftArrow = () => {
    if (this.checkIfTeacher()) this.prevPageAdmin();
    else this.prevPageStudent();
  };

  handleRightArror = () => {
    if (this.checkIfTeacher()) this.nextPageAdmin();
    else this.nextPageStudent();
  };

  componentWillUnmount() {
    Mousetrap.unbind('backspace');
    Mousetrap.unbind('left');
    Mousetrap.unbind('right');
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.forceRenderPage();
    window.addEventListener('resize', this.handleResize);
  }

  shouldComponentUpdate() {
    if (this.queuedRender) return false;
    return true;
  }

  componentDidUpdate(prevProps) {
    if (this.checkIfTeacher() && !this.editorRender) return;

    if (
      this.state.studentPaging &&
      this.state.pageNumStudent !== this.props.data.pageNum &&
      prevProps.data.pageNum !== this.props.data.pageNum
    )
      return;

    if (this.rendering) {
      if (!this.queuedRender) {
        this.queuedRender = true;
        setTimeout(this.queueUpRender, 250);
      }
      return;
    }

    this.editorRender = false;

    this.forceRenderPage();
  }

  queueUpRender = () => {
    if (!this.rendering) {
      this.queuedRender = false;
      if (this.checkIfTeacher()) this.editorRender = true;
      this.forceUpdate();
    } else {
      setTimeout(this.queueUpRender, 250);
    }
  };

  forceRenderPage = () => {
    this.rendering = true;

    const shownPageNum = this.state.studentPaging
      ? this.state.pageNumStudent
      : this.props.data.pageNum;

    if (!this.state.initialLoading && !this.rescaleDone) {
      const containerID = '#pageContainer' + shownPageNum;
      const container = document.querySelector(containerID);

      const rect = container.getBoundingClientRect();
      // console.log(rect.top, rect.right, rect.bottom, rect.left);

      // console.log(container.clientWidth, container.clientHeight);
      const w = window.innerWidth;
      const h = window.innerHeight - rect.top - 10;
      // console.log(w, h);

      const widthScale = w / container.clientWidth;
      const heightScale = h / container.clientHeight;
      // console.log(widthScale, heightScale);
      const newScale = Math.min(widthScale, heightScale);
      // console.log(newScale);
      this.savedScale = newScale;
      this.rescaleDone = true;
    }

    const scale = this.savedScale;

    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale,
      rotate: 0
    };

    const UI = this.PDFJSAnnotate.UI;
    UI.renderPage(shownPageNum, RENDER_OPTIONS).then(
      result => {
        this.rendering = false;
        this.queuedResize = false;
        if (this.state.initialLoading === true) {
          this.editorRender = true;
          this.setState({ initialLoading: false });
        }
        return result;
      },
      err => {
        this.rendering = false;
        console.error('ERROR RENDERING PAGE:\n', err);
      }
    );
  };

  fillPage = () => {
    this.rescaleDone = false;
    this.savedScale = 1;
    this.editorRender = true;
    this.setState({ initialLoading: true });
  };

  handleResize = () => {
    if (this.queuedResize === true) return;
    this.queuedResize = true;
    setTimeout(this.fillPage, 250);
  };

  zoomIn = () => {
    this.savedScale += 0.2;
    this.editorRender = true;
    this.forceUpdate();
  };

  zoomOut = () => {
    this.savedScale -= 0.2;
    this.editorRender = true;
    this.forceUpdate();
  };

  checkIfTeacher = () => {
    const user = this.props.userInfo.name;
    return user === 'teacher';
  };

  getAnnotations = () => this.props.data.annotations;

  getCurrentPageNum = () => {
    if (this.studentPaging) return this.state.pageNumStudent;
    else return this.props.data.pageNum;
  };

  getPageAnnotations = () =>
    this.props.data.annotations[this.getCurrentPageNum()] || [];

  getSavedAnnotations = () =>
    JSON.parse(localStorage.getItem('savedAnnotations')) || {};

  getSavedPageAnnotations = () =>
    JSON.parse(localStorage.getItem('savedAnnotations'))[
      this.getCurrentPageNum()
    ] || [];

  replaceSavedAnnotations = savedAnnotations => {
    localStorage.setItem('savedAnnotations', JSON.stringify(savedAnnotations));
  };

  clearAnnotations = () => {
    this.replaceSavedAnnotations({});
    this.props.dataFn.objSet({}, 'annotations');
    this.editorRender = true;
  };

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

  nextPageAdmin = () => {
    if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
    this.editorRender = true;
    const pageNum = this.props.data.pageNum + 1;
    this.props.dataFn.numIncr(1, ['pageNum']);
    if (
      this.props.activityData.config.studentCannotGoFurther &&
      pageNum > this.props.data.furthestPageNum
    )
      this.props.dataFn.objSet(pageNum, ['furthestPageNum']);
  };

  prevPageAdmin = () => {
    if (this.props.data.pageNum <= 1) return;
    this.editorRender = true;
    this.props.dataFn.numIncr(-1, ['pageNum']);
  };

  nextPageStudent = () => {
    if (this.state.studentPaging) {
      if (this.state.pageNumStudent + 1 > this.props.pdf.numPages) return;
      if (
        this.props.activityData.config.studentCannotGoFurther &&
        this.state.pageNumStudent + 1 > this.props.data.furthestPageNum
      )
        return;
      this.setState(prevstate => ({
        pageNumStudent: prevstate.pageNumStudent + 1
      }));
    } else {
      if (this.props.data.pageNum + 1 > this.props.pdf.numPages) return;
      if (
        this.props.activityData.config.studentCannotGoFurther &&
        this.props.data.pageNum + 1 > this.props.data.furthestPageNum
      )
        return;
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

  getValidPageNum = pageNum => {
    try {
      const newPageNum = Number(pageNum);
      if (newPageNum < 1 || newPageNum > this.props.pdf.numPages) return 0;
      return newPageNum;
    } catch (e) {
      console.error(e);
    }
    return 0;
  };

  changePageAdmin = pageNum => {
    const newPageNum = this.getValidPageNum(pageNum);
    if (newPageNum) {
      this.editorRender = true;
      this.props.dataFn.objSet(newPageNum, ['pageNum']);
      if (newPageNum > this.props.data.furthestPageNum)
        this.props.dataFn.objSet(newPageNum, ['furthestPageNum']);
    }
  };

  changePageStudent = pageNum => {
    const newPageNum = this.getValidPageNum(pageNum);
    const studentCannotGoFurther = this.props.activityData.config
      .studentCannotGoFurther;
    if (
      newPageNum &&
      (!studentCannotGoFurther ||
        (studentCannotGoFurther &&
          newPageNum <= this.props.data.furthestPageNum))
    ) {
      this.setState({
        studentPaging: true,
        pageNumStudent: newPageNum
      });
    }
  };

  checkIfSamePageNum = pageNum =>
    (this.state.studentPaging && this.state.pageNumStudent === pageNum) ||
    (!this.state.studentPaging && this.props.data.pageNum === pageNum);

  undo = () => {
    const currentPageNum = this.getCurrentPageNum();
    const pageAnnotations = this.getPageAnnotations();
    if (pageAnnotations.length === 0) return;

    const index = pageAnnotations.length - 1;
    const annotation = pageAnnotations[index];

    const savedAnnotations = this.getSavedAnnotations();
    if (savedAnnotations[currentPageNum])
      savedAnnotations[currentPageNum].push(annotation);
    else savedAnnotations[currentPageNum] = [annotation];
    this.replaceSavedAnnotations(savedAnnotations);

    this.editorRender = true;
    this.props.dataFn.listDel(null, [
      'annotations',
      currentPageNum,
      index.toString()
    ]);
  };

  redo = () => {
    const savedAnnotations = this.getSavedAnnotations();
    const currentPageNum = this.getCurrentPageNum();
    const pageAnnotations = savedAnnotations[currentPageNum];
    if (pageAnnotations.length === 0) return;

    const annotation =
      savedAnnotations[currentPageNum][pageAnnotations.length - 1];
    savedAnnotations[currentPageNum] = savedAnnotations[currentPageNum].slice(
      0,
      -1
    );
    this.replaceSavedAnnotations(savedAnnotations);

    this.editorRender = true;
    this.props.dataFn.listAppend(annotation, ['annotations', currentPageNum]);
  };

  selectPenSize = e => {
    const size = e.target.value;
    const UI = this.PDFJSAnnotate.UI;
    UI.setPen(size, this.state.penColor);
    this.setState({ penSize: size });
  };

  selectPenColor = color => {
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

    const pageAnnotationsLocalStorage = this.getSavedPageAnnotations();
    const pageAnnotationsDatabase = this.getPageAnnotations();

    const pageContainer = UI.createPage(shownPageNum);
    const svgStyle = pageContainer.querySelector('svg').style;
    svgStyle.position = 'absolute';
    svgStyle.top = '0';
    svgStyle.left = '0';

    const containerStyle = {
      position: 'relative',
      margin: '0 auto'
    };
    if (this.state.initialLoading === true) containerStyle.opacity = 0;

    const pagingText = this.state.studentPaging ? 'Student' : 'Admin';

    const containerID = 'pageContainer' + shownPageNum;
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
      // const text = colorOption[1];
      const style = {
        background: color,
        color: 'white',
        width: '5px',
        height: '15px'
      };
      return (
        <button
          key={'penColor' + color}
          onClick={() => this.selectPenColor(color)}
          style={style}
        >
          {/* {text} */}
        </button>
      );
    });

    const penColorItem = <span key="penColor">{colorOptions}</span>;

    if (this.state.activeItem === 'draw') {
      annotateItems.push(penColorItem);
      annotateItems.push(penSizeItem);
    }

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
        <button
          onClick={this.undo}
          disabled={pageAnnotationsDatabase.length === 0}
        >
          UNDO
        </button>
        <button
          onClick={this.redo}
          disabled={pageAnnotationsLocalStorage.length === 0}
        >
          REDO
        </button>
        <button onClick={this.clearAnnotations}>Clear All Annotations</button>
        <button onClick={this.prevPageAdmin}>Prev Page</button>
        <button onClick={this.nextPageAdmin}>Next Page</button>
        <button onClick={() => this.changePageAdmin(1)}>First</button>
        <button onClick={() => this.changePageAdmin(this.props.pdf.numPages)}>
          Last
        </button>
        <hr />
        <span>Annotate: </span>
        {annotateItems}
      </span>
    );

    const studentItems =
      this.checkIfTeacher() || activityData.config.studentMustFollow ? null : (
        <span>
          <span>Student: </span>
          <button onClick={this.prevPageStudent}>Prev Page</button>
          <button onClick={this.nextPageStudent}>Next Page</button>
          <button onClick={() => this.changePageStudent(1)}>First</button>
          <button
            onClick={() => this.changePageStudent(this.props.pdf.numPages)}
          >
            Last
          </button>
          {this.state.studentPaging && (
            <button onClick={this.goBackToAdminPaging}>Back To Teacher</button>
          )}
        </span>
      );

    return (
      <div>
        <hr />
        {debugItems}
        {editorItems}
        {studentItems}
        <hr />
        <span>Scaling: </span>
        <button onClick={this.fillPage}>Fill Page</button>
        <button onClick={this.zoomOut}>Zoom Out</button>
        <button onClick={this.zoomIn}>Zoom In</button>
        <hr />
        <span>
          Page Num: {shownPageNum}/{this.props.pdf.numPages}, Paging:{' '}
          {pagingText}
        </span>
        <div
          id={containerID}
          style={containerStyle}
          dangerouslySetInnerHTML={{ __html: pageContainer.innerHTML }} // eslint-disable-line react/no-danger
        />
      </div>
    );
  }
}

export default AnnotationLayer;
