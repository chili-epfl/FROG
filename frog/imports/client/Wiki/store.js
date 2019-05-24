import { extendObservable, action } from 'mobx';
import { findKey, flatMap } from 'lodash';
import { WikiContext, values, uuid } from 'frog-utils';
import {
  parseDocResults,
  parsePageObjForReactiveRichText,
  getPageTitle,
  checkNewPageTitle
} from './helpers';

class WikiStore {
  constructor() {
    extendObservable(this, {
      pages: {},

      setPages: action(e => {
        this.pages = e;
      }),

      get parsedPages(): Object {
        const pages = {};
        // eslint-disable-next-line guard-for-in
        for (const pageId in this.pages) {
          const pageObj = this.pages[pageId];
          pages[pageObj.title.toLowerCase()] = pageObj;
        }
        return pages;
      },

      get pagesArray(): Array {
        return flatMap(values(this.pages), pageObj =>
          parsePageObjForReactiveRichText(this.wikiId, pageObj)
        );
      },

      get pagesArrayOnlyValid(): Array {
        return flatMap(
          values(wikiStore.pages).filter(x => x.valid && x.created),
          pageObj => parsePageObjForReactiveRichText(this.wikiId, pageObj)
        );
      },

      getPagesArrayOnlyValidExcludingCurrent(currentPageId: string): Array {
        return this.pagesArrayOnlyValid.filter(x => x.id !== currentPageId);
      }
    });
  }
}

export const wikiStore = new WikiStore();
