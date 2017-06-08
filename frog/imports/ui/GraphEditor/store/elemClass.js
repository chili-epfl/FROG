// @flow
import { computed, action } from 'mobx';
import { store } from './index';

export default class Elem {
  over: boolean;
  wasMoved: boolean = false;
  state: ?string;
  klass: 'operator' | 'activity';
  id: string;

  @action select = (): void => {
    if (store.state.mode === 'readOnly') {
      store.ui.setShowInfo(this.klass, this.id);
      return;
    }
    if (this.wasMoved) {
      this.wasMoved = false;
    } else {
      store.ui.selected = this;
    }
  };

  @computed
  get selected(): boolean {
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

  @computed
  get highlighted(): boolean {
    return (
      this.over &&
      store.state.draggingFrom !== this &&
      store.state.mode === 'dragging'
    );
  }

  @computed
  get color(): string {
    if (this.highlighted) {
      return 'yellow';
    }
    switch (this.state) {
      case 'computing':
        return '#ffff00';
        break;
      case 'computed':
        return '#66ff33';
        break;
      case 'error':
        return '#ff0000';
        break;
      default:
        return 'white';
    }
  }
}
