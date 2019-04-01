import React from 'react';
import ReactDOM from 'react-dom';
import { Quill } from '@houshuang/react-quill';

const Embed = Quill.import('blots/embed');

class WikiLinkBlot extends Embed {
  static create(data) {
    const node = super.create();
    const link = '/wiki/' + data.wikiId + '/' + data.pageTitle;
    const linkElement = document.createElement('a');
    linkElement.href = link;
    linkElement.innerHTML = data.pageTitle;
    linkElement.onclick = e => {
      e.preventDefault();
      window.frog_gotoLink(link);
    };
    node.appendChild(linkElement);

    // ReactDOM.render(
    //   // (<Link to={link}>{data.pageTitle}</Link>),
    //   node
    // );

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
