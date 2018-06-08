import React, { Component } from 'react';
import uuid from 'uuid';
import Mousetrap from 'mousetrap';
import ResizeAware from 'react-resize-aware';

import IconButton from '@material-ui/core/IconButton';

import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import DeleteForever from '@material-ui/icons/DeleteForever';
import ZoomIn from '@material-ui/icons/ZoomIn';
import ZoomOut from '@material-ui/icons/ZoomOut';
import ZoomOutMap from '@material-ui/icons/ZoomOutMap';
import TouchApp from '@material-ui/icons/TouchApp';
import Edit from '@material-ui/icons/Edit';
import Title from '@material-ui/icons/Title';
import CropSquare from '@material-ui/icons/CropSquare';
import Highlight from '@material-ui/icons/Highlight';
import FormatStrikethrough from '@material-ui/icons/FormatStrikethrough';
import SettingsBackupRestore from '@material-ui/icons/SettingsBackupRestore';
import NoteAdd from '@material-ui/icons/NoteAdd';

import constants from './constants.js';

class AnnotationLayer extends Component {
  constructor(props) {
    super();

    const PDFJSAnnotate = require('@houshuang/pdf-annotate.js');
    // const PDFJSAnnotate = require('pdf-annotate').default;
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
        const pageAnnotations = that.getPageAnnotations();

        if (savedAnnotations[currentPageNum] || pageAnnotations.length === 0) {
          that.ignoreRender = false;
        } else {
          that.ignoreRender = true;
        }

        delete savedAnnotations[currentPageNum];
        that.replaceSavedAnnotations(savedAnnotations);

        annotation.class = 'Annotation';
        annotation.uuid = uuid();
        annotation.page = pageNumber;
        if (annotation.type === 'textbox') {
          annotation.size = that.state.penSize * 6;
          annotation.color = that.state.penColor;
        }

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
    PDFJSAnnotate.UI.setPen(constants.defaultSize, constants.defaultColor);
    PDFJSAnnotate.UI.setText(constants.defaultSize * 6, constants.defaultColor);

    localStorage.setItem('aColor', constants.defaultColor);
    localStorage.setItem('aSize', constants.defaultSize);

    this.state = {
      initialPageLoad: true,
      studentPaging: false,
      activeItem: 'cursor',
      penSize: constants.defaultSize,
      penColor: constants.defaultColor
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
    this.rendering = false;
    this.queuedRender = false;
    this.editorRender = false;
    this.resetPaging = true;
    this.savedScale = 1;
    this.rescaleDone = false;
    this.queuedResize = true;
    this.lastLoadedPageNum = 0;
    this.ignoreRender = false;
    this.zoomed = false;
  }

  componentWillMount() {
    if (!localStorage.getItem('savedAnnotations'))
      this.replaceSavedAnnotations({});
    if (this.resetPaging)
      this.props.dataFn.objSet(this.props.data.pageNum, ['furthestPageNum']);
  }

  handleLeftArrow = () => {
    this.prevPage();
  };

  handleRightArror = () => {
    this.nextPage();
  };

  componentWillUnmount() {
    Mousetrap.unbind('backspace');
    Mousetrap.unbind('r');
    Mousetrap.unbind('left');
    Mousetrap.unbind('right');
    Mousetrap.unbind('d');
    Mousetrap.unbind('t');
    Mousetrap.unbind('a');
    Mousetrap.unbind('s');
    Mousetrap.unbind('h');
    Mousetrap.unbind('c');
    // window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.forceRenderPage();

    // window.addEventListener('resize', this.handleResize);
    Mousetrap.bind('backspace', () => this.undo());
    Mousetrap.bind('r', () => this.redo());
    Mousetrap.bind('left', e => {
      e.preventDefault();
      this.handleLeftArrow();
    });
    Mousetrap.bind('right', e => {
      e.preventDefault();
      this.handleRightArror();
    });
    Mousetrap.bind('d', () => this.setActiveToolbarItem('draw'));
    Mousetrap.bind('t', () => this.setActiveToolbarItem('text'));
    Mousetrap.bind('a', () => this.setActiveToolbarItem('area'));
    Mousetrap.bind('s', () => this.setActiveToolbarItem('strikeout'));
    Mousetrap.bind('h', () => this.setActiveToolbarItem('highlight'));
    Mousetrap.bind('c', () => this.setActiveToolbarItem('cursor'));
  }

  shouldComponentUpdate() {
    if (!this.editorRender && this.ignoreRender) {
      this.ignoreRender = false;
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !this.rescaleDone ||
      (this.state.studentPaging &&
        prevState.pageNumStudent !== this.state.pageNumStudent) ||
      (!this.state.studentPaging &&
        prevProps.data.pageNum !== this.props.data.pageNum) ||
      prevState.studentPaging !== this.state.studentPaging
    ) {
      if (this.rendering) {
        this.queueUpRender();
      } else {
        this.forceRenderPage();
      }
      return;
    }

    // if (!this.props.activityData.config.everyoneCanEdit &&
    //   (this.checkIfTeacher() && !this.editorRender))
    //   return;
    this.editorRender = false;
    setTimeout(this.forceRenderAnnotations, 0);
  }

  queueUpRender = () => {
    // console.log('QUEING');
    if (!this.rendering) {
      this.forceRenderPage();
    } else if (this.queuedRender === false) {
      this.queuedRender = true;
      setTimeout(this.queueUpRender, 250);
    }
  };

  calculateNewScale = () => {
    const shownPageNum = this.getCurrentPageNum();
    const containerID = '#pageContainer' + shownPageNum;
    const container = document.querySelector(containerID);
    const viewer = document.querySelector('#viewer');
    // console.log(viewer);
    // console.log(viewer.clientWidth, viewer.clientHeight);

    // const rectViewer = viewer.getBoundingClientRect();
    // const rectContainer = container.getBoundingClientRect();
    // console.log(rectViewer.top, rectViewer.right, rectViewer.bottom, rectViewer.left);
    // console.log(rectContainer.top, rectContainer.right, rectContainer.bottom, rectContainer.left);

    const w = viewer.clientWidth;
    const h = viewer.clientHeight - 70;
    // console.log(w, h);

    const widthScale = w / container.clientWidth;
    const heightScale = h / container.clientHeight;
    // console.log(widthScale, heightScale);
    const newScale = Math.min(widthScale, heightScale);

    return newScale;
  };

  forceRenderAnnotations = () => {
    // console.log('RENDERING ANNOTATIONS');
    const UI = this.PDFJSAnnotate.UI;

    const shownPageNum = this.getCurrentPageNum();

    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: this.savedScale,
      rotate: 0
    };

    UI.renderAnnotations(shownPageNum, RENDER_OPTIONS, this.pageViewport).then(
      result => result,
      err => {
        console.error('ERROR RENDERING ANNOTATIONS:\n', err);
      }
    );
  };

  forceRenderPage = () => {
    // console.log('RENDERING PAGE');
    this.rendering = true;

    const shownPageNum = this.getCurrentPageNum();

    if (!this.state.initialPageLoad && !this.rescaleDone) {
      const newScale = this.calculateNewScale();
      // console.log(newScale);
      this.savedScale = newScale;
      this.rescaleDone = true;
    }

    const RENDER_OPTIONS = {
      documentId: this.props.pdf.fingerprint,
      pdfDocument: this.props.pdf,
      scale: this.savedScale,
      rotate: 0
    };

    const UI = this.PDFJSAnnotate.UI;

    UI.renderPage(shownPageNum, RENDER_OPTIONS).then(
      result => {
        const pdfPage = result[0];
        // const annotationsObj = result[1];
        this.pageViewport = pdfPage.getViewport(this.savedScale, 0);
        this.queuedRender = false;
        this.rendering = false;
        this.lastLoadedPageNum = shownPageNum;
        if (this.state.initialPageLoad && !this.rescaleDone) {
          this.setState({ initialPageLoad: false });
        } else {
          this.queuedResize = false;
        }

        return result;
      },
      err => {
        this.rendering = false;
        this.queuedResize = false;
        console.error('ERROR RENDERING PAGE:\n', err);
      }
    );
  };

  fillPage = () => {
    this.rescaleDone = false;
    this.queuedResize = true;
    this.zoomed = false;
    this.savedScale = 1;
    this.setState({ initialPageLoad: true });
  };

  handleResize = () => {
    if (this.queuedResize || this.zoomed) return;
    this.queuedResize = true;
    setTimeout(this.fillPage, 200);
  };

  zoomIn = () => {
    this.savedScale += 0.2;
    this.zoomed = true;
    this.forceRenderPage();
  };

  zoomOut = () => {
    this.savedScale -= 0.2;
    this.zoomed = true;
    this.forceRenderPage();
  };

  checkIfTeacher = () => {
    const user = this.props.userInfo.name;
    return user === 'teacher';
  };

  getAnnotations = () => this.props.data.annotations;

  getCurrentPageNum = () => {
    if (this.state.studentPaging) return this.state.pageNumStudent;
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
    const currentPageNum = this.getCurrentPageNum();
    const savedAnnotations = this.getSavedAnnotations();
    delete savedAnnotations[currentPageNum];
    this.replaceSavedAnnotations(savedAnnotations);
    this.editorRender = true;
    this.props.dataFn.objDel(null, ['annotations', currentPageNum]);
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
    if (!pageAnnotations || pageAnnotations.length === 0) return;

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
    if (!pageAnnotations || pageAnnotations.length === 0) return;

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
    UI.setText(size * 6, this.state.penColor);
    localStorage.setItem('aSize', size);
    this.setState({ penSize: size });
  };

  selectPenColor = color => {
    const UI = this.PDFJSAnnotate.UI;
    UI.setPen(this.state.penSize, color);
    UI.setText(this.state.penSize * 6, color);
    localStorage.setItem('aColor', color);
    this.setState({ penColor: color });
  };

  changePageAdmin = pageNum => {
    const newPageNum = this.getValidPageNum(pageNum);
    if (newPageNum) {
      this.props.dataFn.objSet(newPageNum, ['pageNum']);
      if (newPageNum > this.props.data.furthestPageNum)
        this.props.dataFn.objSet(newPageNum, ['furthestPageNum']);
    }
  };

  changePage = pageNum => {
    if (this.checkIfTeacher()) this.changePageAdmin(pageNum);
    else this.changePageStudent(pageNum);
  };

  nextPage = () => {
    if (this.checkIfTeacher()) this.nextPageAdmin();
    else this.nextPageStudent();
  };

  prevPage = () => {
    if (this.checkIfTeacher()) this.prevPageAdmin();
    else this.prevPageStudent();
  };

  render() {
    const { activityData } = this.props;

    const UI = this.PDFJSAnnotate.UI;

    const shownPageNum = this.getCurrentPageNum();

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
    if (this.state.initialPageLoad === true) containerStyle.opacity = 0;

    const containerID = 'pageContainer' + shownPageNum;

    const iconMapping = {
      cursor: <TouchApp />,
      draw: <Edit />,
      text: <Title />,
      area: <CropSquare />,
      highlight: <Highlight />,
      strikeout: <FormatStrikethrough />
    };

    const iconButtonStyle = {
      width: '48px'
    };

    let annotateItems = constants.toolbarItems.map(item => {
      const icon = iconMapping[item];
      let color = 'primary';
      if (this.state.activeItem === item) color = 'secondary';

      return (
        <IconButton
          style={iconButtonStyle}
          color={color}
          key={item}
          onClick={() => this.setActiveToolbarItem(item)}
        >
          {icon}
        </IconButton>
      );
    });

    const sizeOptions = constants.sizeOptions.map(size => (
      <option key={'penSize' + size} value={size}>
        {' '}
        {size}
      </option>
    ));

    const selectStyle = {
      display: 'inline-block',
      fontSize: '14px',
      fontFamily: 'sans-serif',
      marginLeft: '10px'
    };

    const penSizeItem = (
      <select
        key="penSize"
        id="sizeSelect"
        value={this.state.penSize}
        onChange={this.selectPenSize}
        style={selectStyle}
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
        width: '16px',
        height: '16px',
        borderRadius: '8px',
        border: 'none',
        margin: '0 2px',
        marginTop: '1px'
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

    let drawingItems = [];
    if (
      this.state.activeItem === 'draw' ||
      this.state.activeItem === 'area' ||
      this.state.activeItem === 'text'
    ) {
      drawingItems.push(penColorItem);
      drawingItems.push(penSizeItem);
    } else {
      drawingItems.push(penColorItem);
      drawingItems.push(penSizeItem);
    }

    const debugItems = !activityData.config.debug ? null : (
      <span>
        <span>Debugging: </span>
        <button onClick={this.forceRenderPage}>Force Re-Render</button>
        <hr />
      </span>
    );

    const disabledRight =
      this.props.activityData.config.studentCannotGoFurther &&
      this.getCurrentPageNum() === this.props.pdf.furthestPageNum;

    const pageSpanStyle = {
      display: 'inline-block',
      height: '50px',
      width: '50px',
      margin: '0 0',
      fontSize: '15px',
      textAlign: 'center'
    };

    if (this.state.studentPaging) pageSpanStyle.fontSize = '11px';

    const goBackToAdminButtonStyle = {
      height: '24px',
      width: '24px'
    };

    const goBackToAdminButton = (
      <IconButton
        style={goBackToAdminButtonStyle}
        onClick={this.goBackToAdminPaging}
      >
        <SettingsBackupRestore />
      </IconButton>
    );

    const pagingIconStyle = {
      width: '25px'
    };

    const pagingItems = this.props.activityData.config.studentMustFollow ? (
      <span>{shownPageNum + '/' + this.props.pdf.numPages}</span>
    ) : (
      <span>
        <IconButton style={pagingIconStyle} onClick={() => this.changePage(1)}>
          <FirstPage />
        </IconButton>
        <IconButton style={pagingIconStyle} onClick={this.prevPage}>
          <ChevronLeft />
        </IconButton>
        <span style={pageSpanStyle}>
          {shownPageNum + '/' + this.props.pdf.numPages}
          {this.state.studentPaging && goBackToAdminButton}
        </span>
        <IconButton
          style={pagingIconStyle}
          onClick={this.nextPage}
          disabled={disabledRight}
        >
          <ChevronRight />
        </IconButton>
        <IconButton
          style={pagingIconStyle}
          onClick={() => this.changePage(this.props.pdf.numPages)}
        >
          <LastPage />
        </IconButton>
      </span>
    );

    const cursorColor =
      this.state.activeItem === 'cursor' ? 'secondary' : 'primary';
    const cursorStyle = {};
    let cursorDisable = false;

    if (
      !this.checkIfTeacher() &&
      !this.props.activityData.config.everyoneCanEdit
    ) {
      cursorStyle.visibility = 'hidden';
      cursorDisable = true;
    }

    const cursorItem = (
      <IconButton
        disabled={cursorDisable}
        style={Object.assign({}, cursorStyle, iconButtonStyle)}
        color={cursorColor}
        onClick={() => this.setActiveToolbarItem('cursor')}
      >
        <TouchApp />
      </IconButton>
    );

    const zoomingItems = (
      <span>
        {cursorItem}
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.fillPage}
        >
          <ZoomOutMap />
        </IconButton>
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.zoomOut}
        >
          <ZoomOut />
        </IconButton>
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.zoomIn}
        >
          <ZoomIn />
        </IconButton>
      </span>
    );

    let modifyingitems = (
      <span>
        <IconButton
          style={iconButtonStyle}
          color="secondary"
          onClick={this.props.switchMode}
        >
          <NoteAdd />
        </IconButton>
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.undo}
          disabled={pageAnnotationsDatabase.length === 0}
        >
          <Undo />
        </IconButton>
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.redo}
          disabled={pageAnnotationsLocalStorage.length === 0}
        >
          <Redo />
        </IconButton>
        <IconButton
          style={iconButtonStyle}
          color="primary"
          onClick={this.clearAnnotations}
          disabled={
            pageAnnotationsDatabase.length === 0 &&
            pageAnnotationsLocalStorage.length === 0
          }
        >
          <DeleteForever />
        </IconButton>
      </span>
    );

    const toolbarStyle = {
      minHeight: '50px',
      paddingTop: '5px',
      borderBottom: '1px solid lightblue',
      marginBottom: '5px'
    };

    const groupDivStyle = {
      display: 'inline-block',
      height: '50px',
      textAlign: 'center',
      verticalAlign: 'top'
    };

    const leftyStyle = {
      width: '27%',
      minWidth: '250px'
    };

    const drawingItemsStyle = {
      width: '15%',
      lineHeight: '50px',
      minWidth: '125px'
    };

    const midStyle = {
      width: '16%',
      minWidth: '160px'
    };

    const zoomyStyle = {
      width: '21%',
      minWidth: '200px'
    };

    const rightyStyle = {
      width: '21%',
      minWidth: '200px'
    };

    if (!drawingItems) {
      drawingItemsStyle.height = '10px';
    }

    if (
      !this.checkIfTeacher() &&
      !this.props.activityData.config.everyoneCanEdit
    ) {
      annotateItems = null;
      modifyingitems = null;
      drawingItems = null;
      leftyStyle.height = '10px';
      drawingItemsStyle.height = '10px';
      rightyStyle.height = '10px';
      leftyStyle.width = '0px';
      drawingItemsStyle.width = '0px';
      rightyStyle.width = '0px';
      leftyStyle.minWidth = '0px';
      drawingItemsStyle.minWidth = '0px';
      rightyStyle.minWidth = '0px';
      zoomyStyle.width = '40%';
      zoomyStyle.textAlign = 'center';
      midStyle.width = '60%';
      midStyle.textAlign = 'right';
    }

    return (
      <ResizeAware
        style={{ position: 'relative', height: '100%' }}
        onlyEvent
        onResize={this.handleResize}
      >
        <div>
          {debugItems}
          <div style={toolbarStyle}>
            <div style={Object.assign({}, groupDivStyle, leftyStyle)}>
              {annotateItems}
            </div>
            <div style={Object.assign({}, groupDivStyle, drawingItemsStyle)}>
              <span>{drawingItems}</span>
            </div>
            <div style={Object.assign({}, groupDivStyle, midStyle)}>
              {pagingItems}
            </div>
            <div style={Object.assign({}, groupDivStyle, zoomyStyle)}>
              {zoomingItems}
            </div>
            <div style={Object.assign({}, groupDivStyle, rightyStyle)}>
              {modifyingitems}
            </div>
          </div>
          <div
            id={containerID}
            style={containerStyle}
            dangerouslySetInnerHTML={{ __html: pageContainer.innerHTML }} // eslint-disable-line react/no-danger
          />
        </div>
      </ResizeAware>
    );
  }
}

export default AnnotationLayer;
