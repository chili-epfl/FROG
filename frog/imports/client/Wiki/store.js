import { extendObservable, action } from 'mobx';

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
      }
    });
  }
}

export const wikistore = new WikiStore();
