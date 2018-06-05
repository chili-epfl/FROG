import React, { Component } from 'react';
import uuid from 'uuid';
import PDFJS from '@houshuang/pdfjs-dist';
import constants from './constants.js';

class ScratchPad extends Component {
  constructor() {
    super();

    const location = window.location;
    this.pdfSRC =
      location.protocol +
      '//' +
      location.hostname +
      (location.port ? ':' + location.port : '') +
      '/file?name=ac/ac-prez/blank.pdf';
    this.pdf = null;

    const PDFJSAnnotate = require('pdf-annotate').default;

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

        const annotations = that.getAnnotations();
        annotations.push(annotation);
        that.replaceAnnotations(annotations);
        that.removeSavedAnnotations();

        that.forceUpdate();
        return Promise.resolve(annotation);
      },

      editAnnotation(documentId, pageNumber, annotation) {
        const annotations = that.getAnnotations();
        const index = annotations.findIndex(x => x.uuid === annotation.uuid);

        return new Promise((resolve, reject) => {
          if (index === -1) reject(new Error('Could not find annotation!'));
          else {
            annotations[index] = annotation;
            that.replaceAnnotations(annotations);

            that.forceUpdate();
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
            annotations.splice(index, 1);
            that.replaceAnnotations(annotations);

            that.forceUpdate();
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
    PDFJSAnnotate.UI.setPen(1, '#000000');

    this.state = {
      activeItem: 'cursor',
      penSize: 1,
      penColor: '#000000'
    };

    this.PDFJSAnnotate = PDFJSAnnotate;
  }

  componentDidMount() {
    this.getPDF();
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

  clearAnnotations = () => {
    localStorage.removeItem('ScratchPadAnnotations');
    localStorage.removeItem('savedScratchPadAnnotations');
    this.forceUpdate();
  };

  getAnnotations = () =>
    JSON.parse(localStorage.getItem('ScratchPadAnnotations') || '[]');

  replaceAnnotations = annotations => {
    localStorage.setItem('ScratchPadAnnotations', JSON.stringify(annotations));
  };

  removeSavedAnnotations = () => {
    localStorage.removeItem('savedScratchPadAnnotations');
  };

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
    const annotation = annotations[annotations.length - 1];
    annotations.splice(annotations.length - 1, 1);
    this.replaceAnnotations(annotations);
    const savedAnnotations = this.getSavedAnnotations();
    savedAnnotations.push(annotation);
    this.replaceSavedAnnotations(savedAnnotations);

    this.forceUpdate();
  };

  redo = () => {
    const annotations = this.getAnnotations();
    const savedAnnotations = this.getSavedAnnotations();
    const annotation = savedAnnotations[savedAnnotations.length - 1];
    savedAnnotations.splice(savedAnnotations.length - 1, 1);
    annotations.push(annotation);
    this.replaceAnnotations(annotations);
    this.replaceSavedAnnotations(savedAnnotations);

    this.forceUpdate();
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
    this.setState({ penSize: size });
  };

  selectPenColor = color => {
    const UI = this.PDFJSAnnotate.UI;
    UI.setPen(this.state.penSize, color);
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

    if (this.state.activeItem === 'draw') {
      annotateItems.push(penColorItem);
      annotateItems.push(penSizeItem);
    }

    const editorItems = (
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
      </span>
    );

    return (
      <div>
        <hr />
        {editorItems}
        <hr />
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
