import { extendObservable, action } from 'mobx';

class WikiStore {
  constructor() {
    extendObservable(this, {
      pages: {},
      wikiDoc: null,
      history: {},
      wikiId: null,
      ref: null,
      setPages: action(e => {
        this.pages = e;
      }),
      setWikiId: action(e => {
        this.wikiId = e;
      }),
      setHistory: action(e => {
        this.push = e.push;
        this.push2 = e.push2;
      }),
      setWikiDoc: action(e => {
        this.wikiDoc = e;
      }),
      setRef: action(e => {
        this.ref = e;
      })
    });
  }
}

export const wikistore = new WikiStore();
