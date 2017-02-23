// @flow
import { computed, action } from 'mobx';
import { store } from './index';

export default class Elem {
  @action select = (): void => {
    store.ui.selected = this;
  };

  @computed get selected(): boolean {
    return store.ui.selected === this;
  }

  @action remove = () => {
    this.store.all = this.store.all.filter(x => x !== this);
    store.connectionStore.cleanDangling();
    store.addHistory();
  };

  @computed get highlighted(): boolean {
    return this.over &&
      store.draggingFromActivity !== this &&
      store.state.mode === 'dragging';
  }
}
