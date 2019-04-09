import { extendObservable, action, toJS } from 'mobx';
import { inject, observer } from 'mobx-react';

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
