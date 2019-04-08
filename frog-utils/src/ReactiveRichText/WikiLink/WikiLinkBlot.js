import React from 'react';
import ReactDOM from 'react-dom';
import { Quill } from '@houshuang/react-quill';
import { WikiContext } from 'frog-utils';

const Embed = Quill.import('blots/embed');

class WikiLinkBlot extends Embed {
  static create(data) {
    
    const node = super.create();
    const link = '/wiki/' + data.wikiId + '/' + data.title;
    // const linkElement = document.createElement('a');
    // linkElement.href = link;
    // linkElement.innerHTML = data.title;
    // linkElement.onclick = e => {
    //   e.preventDefault();
    //   window.frog_gotoLink(link);
    // };
    // node.appendChild(linkElement);

    const linkFn = (e, wikiContext) => {
      console.log(wikiContext);
      e.preventDefault();
      window.frog_gotoLink(link);
    }

    ReactDOM.render((
      <WikiContext.Consumer>
        {wikiContext => (
          <a href={link} onClick={(e) => linkFn(e, wikiContext)}>{data.title}</a>
        )}
      </WikiContext.Consumer>
      ),
      node
    );

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
