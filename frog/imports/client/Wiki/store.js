import { extendObservable, action, toJS } from 'mobx';
import { values } from 'frog-utils';

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
        return values(this.pages);
      },

      get pagesArrayOnlyValid(): Array {
        return values(toJS(wikiStore.pages)).filter(x => x.valid && x.created);
      }
    });
  }
}

export const wikiStore = new WikiStore();
