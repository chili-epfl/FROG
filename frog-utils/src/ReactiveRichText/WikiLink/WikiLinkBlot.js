import React from 'react';
import ReactDOM from 'react-dom';
import { Quill } from '@houshuang/react-quill';

const Embed = Quill.import('blots/embed');

class WikiLinkBlot extends Embed {
  static create(data) {
    const node = super.create();
    const WikiLink = window.frog_WikiLink;
    ReactDOM.render(<WikiLink data={data} />, node);

    return this.setDataValues(node, data);
  }

  static setDataValues(element, data) {
    const domNode = element;
    Object.keys(data).forEach(key => {
      domNode.dataset[key] = data[key];
    });
    return domNode;
  }

  static value(domNode) {
    return domNode.dataset;
  }
}

WikiLinkBlot.blotName = 'wiki-link';
WikiLinkBlot.tagName = 'span';
WikiLinkBlot.className = 'wiki-link';

export default WikiLinkBlot;
