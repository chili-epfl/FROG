import React, { Component } from 'react';
import uuid from 'uuid';
import PDFJS from '@houshuang/pdfjs-dist';
import Mousetrap from 'mousetrap';
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
      penColor: constants.defaultColor
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
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

  forceRenderPage = () => {
    const RENDER_OPTIONS = {
      documentId: this.pdf.fingerprint,
      pdfDocument: this.pdf,
      scale: 1,
      rotate: 0
    };

    const UI = this.PDFJSAnnotate.UI;
    UI.renderPage(1, RENDER_OPTIONS).then(
      result => result,
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
    const activeToolTipStyle = {
      border: '2px solid lightblue',
      borderRadius: '2px'
    };

    const annotateItems = constants.ScratchPadToolbarItems.map(item => {
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

    if (
      this.state.activeItem === 'draw' ||
      this.state.activeItem === 'area' ||
      this.state.activeItem === 'text'
    ) {
      annotateItems.push(penColorItem);
      annotateItems.push(penSizeItem);
    }

    const editorItems =
      !this.props.activityData.config.everyoneCanEdit &&
      !this.checkIfTeacher() ? null : (
        <span>
          <span>Options: </span>
          <button
            onClick={this.undo}
            disabled={this.getAnnotations().length === 0}
          >
            UNDO
          </button>
          <button
            onClick={this.redo}
            disabled={this.getSavedAnnotations().length === 0}
          >
            REDO
          </button>
          <button onClick={this.clearAnnotations}>Clear All Annotations</button>
          <hr />
          <span>Annotate: </span>
          {annotateItems}
          <hr />
        </span>
      );

    return (
      <div>
        <hr />
        {editorItems}
        <div
          id={divIDTest}
          style={testStyle}
          dangerouslySetInnerHTML={{ __html: test.innerHTML }} // eslint-disable-line react/no-danger
        />
      </div>
    );
  }
}

export default ScratchPad;
