import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { wikistore } from './store';

import { markPageAsCreated } from './wikiDocHelpers';

const WikiLink = observer(
  class W extends React.Component<*, *> {
    ref: null;
    render() {
      const { data } = this.props;

      const pageObj = wikistore.pages[data.id];
      const style = {
        textDecoration: 'underline',
        cursor: 'pointer',
        color: 'black'
      };
      if (!pageObj) {
        return <span style={style}>INVALID LINK</span>;
      }
      const pageTitle = pageObj.title;
      const link =
        '/wiki/' +
        wikistore.wikiId +
        '/' +
        pageTitle +
        (data.instance ? '/' + data.instance : '');

      const linkFn = e => {
        e.preventDefault();
        const side = this.ref.closest('.reactRichText')?.dataset.wikiSide;
        const sideToSend =
          (side === 'left' && !e.shiftKey) || (side === 'right' && e.shiftKey)
            ? 'left'
            : 'right';
        console.log(side, e.shiftKey, sideToSend);
        const push = sideToSend === 'left' ? wikistore.push : wikistore.push2;
        push(link);
      };

      const createLinkFn = e => {
        e.preventDefault();
        const linkWithEdit = link + '?edit=true';
        const side = this.ref.closest('.reactRichText')?.dataset.wikiSide;
        const sideToSend =
          (side === 'left' && !e.shiftKey) || (side === 'right' && e.shiftKey)
            ? 'left'
            : 'right';
        const push = sideToSend === 'left' ? wikistore.push : wikistore.push2;
        push(linkWithEdit);
        setTimeout(() => markPageAsCreated(wikistore.wikiDoc, pageObj.id), 500);
      };
      const displayTitle =
        pageTitle + (data.instance ? '/' + data.instance : '');

      if (!pageObj.created) {
        style.color = 'green';

        return (
          <span ref={e => (this.ref = e)} onClick={createLinkFn} style={style}>
            <b>{displayTitle}</b>
          </span>
        );
      }

      const deletePageLinkFn = e => {
        e.preventDefault();
        this.setState({
          deletedPageModalOpen: true,
          currentDeletedPageId: pageObj.id,
          currentDeletedPageTitle: pageObj.title
        });
      };
      if (!pageObj.valid) {
        style.color = 'red';
        style.cursor = 'not-allowed';
        return (
          <span
            ref={e => (this.ref = e)}
            onClick={deletePageLinkFn}
            style={style}
          >
            {pageTitle}
          </span>
        );
      }

      style.color = 'blue';

      return (
        <span ref={e => (this.ref = e)} onClick={linkFn} style={style}>
          <b>{displayTitle}</b>
        </span>
      );
    }
  }
);

export default WikiLink;
