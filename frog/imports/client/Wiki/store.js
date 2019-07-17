import { extendObservable, action, toJS } from 'mobx';
import { values } from '/imports/frog-utils';
import { sanitizeTitle } from './helpers';

class WikiStore {
  constructor() {
    extendObservable(this, {
      pages: {},
      noFollowLinks: false,

      setNoFollowLinks: action(e => {
        this.noFollowLinks = e;
      }),

      setPages: action(e => {
        this.pages = e;
      }),

      get parsedPages(): Object {
        const pages = {};
        // eslint-disable-next-line guard-for-in
        for (const pageId in this.pages) {
          const pageObj = this.pages[pageId];
          pages[sanitizeTitle(pageObj.title.toLowerCase())] = pageObj;
        }
        return pages;
      },

      get pagesArray(): Array {
        return values(this.pages);
      },

      get pagesArrayOnlyValid(): Array {
        return values(toJS(wikiStore.pages)).filter(x => x.valid && x.created);
      },

      get pagesArrayOnlyInvalid(): Array {
        return values(toJS(wikiStore.pages)).filter(x => !x.valid && x.created);
      },

      get pagesByTitle(): Array {
        return Object.keys(toJS(wikiStore.pages)).reduce((acc, x) => {
          const page = wikiStore.pages[x];
          acc[page.title] = { ...page, id: x };
          return acc;
        }, {});
      }
    });
  }
}

export const wikiStore = new WikiStore();
