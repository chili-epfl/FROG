// @flow
import { computed, action } from 'mobx';
import { store } from './index';

export default class Elem {
  over: boolean;
  wasMoved: boolean = false;
  @action select = (): void => {
    if (this.wasMoved) {
      this.wasMoved = false;
    } else {
      store.ui.selected = this;
    }
  };

  @computed get selected(): boolean {
    return store.ui.selected === this;
  }

  @action remove = () => {
    let thisstore;
    if (this.klass === 'activity') {
      thisstore = store.activityStore;
    } else if (this.klass === 'operator') {
      thisstore = store.operatorStore;
    } else {
      thisstore = store.connectionStore;
    }
    thisstore.all = thisstore.all.filter(x => x !== this);
    store.connectionStore.cleanDangling();
    store.addHistory();
  };

  @computed get highlighted(): boolean {
    return (
      this.over &&
      store.state.draggingFrom !== this &&
      store.state.mode === 'dragging'
    );
  }
}
