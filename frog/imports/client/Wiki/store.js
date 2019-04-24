import { extendObservable, action } from 'mobx';

class WikiStore {
  constructor() {
    extendObservable(this, {
      pages: {},
      setPages: action(e => {
        this.pages = e;
      })
    });
  }
}

export const wikistore = new WikiStore();
