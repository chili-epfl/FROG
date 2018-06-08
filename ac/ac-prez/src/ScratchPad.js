import React, { Component } from 'react';
import uuid from 'uuid';
import PDFJS from '@houshuang/pdfjs-dist';
import Mousetrap from 'mousetrap';
import ResizeAware from 'react-resize-aware';

import IconButton from '@material-ui/core/IconButton';

import Undo from '@material-ui/icons/Undo';
import Redo from '@material-ui/icons/Redo';
import DeleteForever from '@material-ui/icons/DeleteForever';
import TouchApp from '@material-ui/icons/TouchApp';
import Edit from '@material-ui/icons/Edit';
import Title from '@material-ui/icons/Title';
import CropSquare from '@material-ui/icons/CropSquare';
import Highlight from '@material-ui/icons/Highlight';
import FormatStrikethrough from '@material-ui/icons/FormatStrikethrough';
import PresentToAll from '@material-ui/icons/PresentToAll';

import constants from './constants.js';

class ScratchPad extends Component {
  constructor(props) {
    super();

    const location = window.location;
    this.pdfSRC =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '') +
      '/file?name=ac/ac-prez/blank.pdf';
    this.pdf = null;

    const PDFJSAnnotate = require('@houshuang/pdf-annotate.js');

    const that = this;

    const StoreAdapter = new PDFJSAnnotate.StoreAdapter({
      getAnnotations(documentId, pageNumber) {
        const annotations = that.getAnnotations();
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
        annotation.class = 'Annotation';
        annotation.uuid = uuid();
        annotation.page = pageNumber;
        if (annotation.type === 'textbox') {
          annotation.size = that.state.penSize * 6;
          annotation.color = that.state.penColor;
        }

        const annotations = that.getAnnotations();
        annotations.push(annotation);
        if (annotations.length === 0)
          props.dataFn.objInsert([annotation], ['scratchpadAnnotations']);
        else props.dataFn.listAppend(annotation, ['scratchpadAnnotations']);

        that.replaceSavedAnnotations([]);
        return Promise.resolve(annotation);
      },

      editAnnotation(documentId, pageNumber, annotation) {
        const annotations = that.getAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotation.uuid);

        return new Promise((resolve, reject) => {
          if (index === -1) reject(new Error('Could not find annotation!'));
          else {
            annotations[index] = annotation;
            props.dataFn.objSet(annotation, [
              'scratchpadAnnotations',
              index.toString()
            ]);
            resolve(annotation);
          }
        });
      },

      deleteAnnotation(documentId, annotationId) {
        const annotations = that.getAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotationId);
        return new Promise((resolve, reject) => {
          if (index === -1) reject(new Error('Could not find annotation!'));
          else {
            const savedAnnotations = that.getSavedAnnotations();
            savedAnnotations.push(annotations[index]);
            that.replaceSavedAnnotations(savedAnnotations);

            props.dataFn.listDel(null, ['scratchpadAnnotations', index]);
            resolve(true);
          }
        });
      },

      getComments() {
        return Promise.resolve([]);
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
      activeItem: 'cursor',
      penSize: constants.defaultSize,
      penColor: constants.defaultColor,
      initalPageLoad: true
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
    this.rescaleDone = false;
    this.queuedResize = true;
  }

  componentWillUnmount() {
    Mousetrap.unbind('backspace');
    Mousetrap.unbind('r');
    Mousetrap.unbind('d');
    Mousetrap.unbind('t');
    Mousetrap.unbind('a');
    Mousetrap.unbind('c');
    window.removeEventListener('resize', this.handleResize);
  }

  componentDidMount() {
    this.getPDF();
    Mousetrap.bind('backspace', () => this.undo());
    Mousetrap.bind('r', () => this.redo());
    Mousetrap.bind('d', () => this.setActiveToolbarItem('draw'));
    Mousetrap.bind('t', () => this.setActiveToolbarItem('text'));
    Mousetrap.bind('a', () => this.setActiveToolbarItem('area'));
    Mousetrap.bind('c', () => this.setActiveToolbarItem('cursor'));
  }

  componentDidUpdate() {
    this.forceRenderPage();
  }

  getPDF = () => {
    PDFJS.getDocument(this.pdfSRC).then(pdf => {
      this.pdf = pdf;
      this.forceUpdate();
    });
  };

  calculateNewScale = () => {
    const shownPageNum = 1;
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

  fillPage = () => {
    this.rescaleDone = false;
    this.queuedResize = true;
    this.savedScale = 1;
    this.setState({ initialPageLoad: true });
  };

  handleResize = () => {
    if (this.queuedResize) return;
    this.queuedResize = true;
    setTimeout(this.fillPage, 200);
  };

  forceRenderPage = () => {
    if (!this.state.initialPageLoad && !this.rescaleDone) {
      const newScale = this.calculateNewScale();
      // console.log(newScale);
      this.savedScale = newScale;
      this.rescaleDone = true;
    }

    const RENDER_OPTIONS = {
      documentId: this.pdf.fingerprint,
      pdfDocument: this.pdf,
      scale: this.savedScale,
      rotate: 0
    };

    const UI = this.PDFJSAnnotate.UI;
    UI.renderPage(1, RENDER_OPTIONS).then(
      result => {
        if (this.state.initialPageLoad && !this.rescaleDone) {
          this.setState({ initialPageLoad: false });
        } else {
          this.queuedResize = false;
        }

        return result;
      },
      err => {
        console.error('ERROR RENDERING PAGE:\n', err);
      }
    );
  };

  checkIfTeacher = () => {
    const user = this.props.userInfo.name;
    return user === 'teacher';
  };

  clearAnnotations = () => {
    this.replaceSavedAnnotations([]);
    this.props.dataFn.objSet([], 'scratchpadAnnotations');
  };

  getAnnotations = () => this.props.data.scratchpadAnnotations;

  getSavedAnnotations = () =>
    JSON.parse(localStorage.getItem('savedScratchPadAnnotations') || '[]');

  replaceSavedAnnotations = savedAnnotations => {
    localStorage.setItem(
      'savedScratchPadAnnotations',
      JSON.stringify(savedAnnotations)
    );
  };

  undo = () => {
    const annotations = this.getAnnotations();
    if (annotations.length === 0) return;

    const index = annotations.length - 1;
    const annotation = annotations[index];
    this.props.dataFn.listDel(null, [
      'scratchpadAnnotations',
      index.toString()
    ]);

    const savedAnnotations = this.getSavedAnnotations();
    savedAnnotations.push(annotation);
    this.replaceSavedAnnotations(savedAnnotations);
  };

  redo = () => {
    const savedAnnotations = this.getSavedAnnotations();
    if (savedAnnotations.length === 0) return;

    const annotation = savedAnnotations[savedAnnotations.length - 1];
    savedAnnotations.splice(savedAnnotations.length - 1, 1);
    this.replaceSavedAnnotations(savedAnnotations);

    this.props.dataFn.listAppend(annotation, ['scratchpadAnnotations']);
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

  render() {
    const pageAnnotationsLocalStorage = this.getSavedAnnotations();
    const pageAnnotationsDatabase = this.getAnnotations();

    const UI = this.PDFJSAnnotate.UI;

    const test = UI.createPage(1);
    const svgStyle = test.querySelector('svg').style;
    svgStyle.position = 'absolute';
    svgStyle.top = '0';
    svgStyle.left = '0';

    const testStyle = {
      position: 'relative',
      margin: '0 auto'
    };

    const divIDTest = 'pageContainer' + 1;

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

    let annotateItems = constants.ScratchPadToolbarItems.map(item => {
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

    let modifyingitems = (
      <span>
        <IconButton
          style={iconButtonStyle}
          color="secondary"
          onClick={this.props.switchMode}
        >
          <PresentToAll />
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
      width: '30%',
      minWidth: '250px'
    };

    const drawingItemsStyle = {
      width: '15%',
      lineHeight: '50px',
      minWidth: '125px'
    };

    const midStyle = {
      width: '10%',
      lineHeight: '50px'
    };

    const rightyStyle = {
      width: '45%',
      minWidth: '200px'
    };

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
      midStyle.width = '100%';
    }

    return (
      <ResizeAware
        style={{ position: 'relative', height: '100%' }}
        onlyEvent
        onResize={this.handleResize}
      >
        <div>
          <div style={toolbarStyle}>
            <div style={Object.assign({}, groupDivStyle, leftyStyle)}>
              {annotateItems}
            </div>
            <div style={Object.assign({}, groupDivStyle, drawingItemsStyle)}>
              <span>{drawingItems}</span>
            </div>
            <div style={Object.assign({}, groupDivStyle, midStyle)}>
              <span>ScratchPad</span>
            </div>
            <div style={Object.assign({}, groupDivStyle, rightyStyle)}>
              {modifyingitems}
            </div>
          </div>
          <div
            id={divIDTest}
            style={testStyle}
            dangerouslySetInnerHTML={{ __html: test.innerHTML }} // eslint-disable-line react/no-danger
          />
        </div>
      </ResizeAware>
    );
  }
}

export default ScratchPad;
