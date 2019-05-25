import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { WikiContext, uuid } from 'frog-utils';

import { markPageAsCreated } from '/imports/api/wikiDocHelpers';
import { wikiStore } from './store';

const WikiLink = observer(
  class W extends React.Component<*, *> {
    ref: null;

    render() {
      const { data } = this.props;
      const pageObj = wikiStore.pages[data.id];

      const style = {
        textDecoration: 'underline',
        cursor: 'pointer',
        color: 'black'
      };

      if (!pageObj) {
        return <span style={style}>INVALID LINK</span>;
      }

      const pageId = pageObj.id;
      const pageTitle = pageObj.title;
      const displayTitle =
        pageTitle + (data.instance ? '/' + data.instance : '');

      if (!pageObj.created) {
        const createLinkFn = e => {
          e.preventDefault();
          markPageAsCreated(window.wikiDoc, pageObj.id);
          const side = this.ref.closest('.reactRichText')?.dataset.wikiSide;
          window.wiki.goToPage(pageId, null, side);
        };

        style.color = 'green';

        return (
          <span ref={e => (this.ref = e)} onClick={createLinkFn} style={style}>
            <b>{displayTitle}</b>
          </span>
        );
      }

      if (!pageObj.valid) {
        const deletedPageLinkFn = e => {
          e.preventDefault();
          window.wiki.openDeletedPageModal(pageId, pageTitle);
        };
        style.color = 'red';

        return (
          <span
            ref={e => (this.ref = e)}
            onClick={deletedPageLinkFn}
            style={style}
          >
            {pageTitle}
          </span>
        );
      }

      const linkFn = e => {
        e.preventDefault();
        const side = this.ref.closest('.reactRichText')?.dataset.wikiSide;
        window.wiki.goToPage(pageId, null, side);
      };
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
