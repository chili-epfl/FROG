// @flow
//
import { extendObservable, computed, action } from 'mobx';
import { store } from './index';

export default class Elem {
  constructor() {
    extendObservable(this, {
      select: action(() => {
        if (store.state.mode === 'readOnly') {
          if (this.klass !== 'connection') {
            store.ui.setShowInfo(this.klass, this.id);
          }
        } else if (this.wasMoved) {
          this.wasMoved = false;
        } else {
          store.ui.selected = this;
        }
      }),

      remove: action(() => {
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
      }),

      get selected(): boolean {
        return store.ui.selected === this;
      },

      get color(): string {
        if (store.ui.isSvg) {
          return 'white';
        }
        if (this.highlighted) {
          return 'yellow';
        }
        switch (this.state) {
          case 'computing':
            return '#ffff00';
          case 'computed':
            return '#72FF70';
          case 'error':
            return '#ff0000';
          default:
            return 'white';
        }
      },

      get highlighted(): boolean {
        return (
          this.over &&
          store.state.draggingFrom !== this &&
          store.state.mode === 'dragging'
        );
      },

      get strokeColor(): string {
        const errors = store.graphErrors.filter(x => x.id === this.id);
        if (errors.length === 0) {
          return 'grey';
        }
        if (errors.find(x => x.type === 'missingType')) {
          return '#e6e8fc';
        }
        return '#C72616';
      }
    });
  }
}
