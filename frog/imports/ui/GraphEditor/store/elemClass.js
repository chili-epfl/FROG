//
import { extendObservable, action } from 'mobx';
import { flatten, compact } from 'lodash';
import { store } from './index';

export default class Elem {
  constructor() {
    extendObservable(this, {
      select: action(() => {
        store.ui.setLibraryOpen(false);
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

      remove: action(shift => {
        let thisstore;
        if (this.klass === 'activity') {
          thisstore = store.activityStore;
        } else if (this.klass === 'operator') {
          thisstore = store.operatorStore;
        } else {
          thisstore = store.connectionStore;
        }
        if (this.klass === 'activity' && shift) {
          store.activityStore.moveDelete(this);
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

      get incoming() {
        return store.connectionStore.all
          .filter(x => x.target === this)
          .map(x => x.source);
      },

      get outgoing() {
        return store.connectionStore.all
          .filter(x => x.source === this)
          .map(x => x.target);
      },

      get socialInputs() {
        if (!this.incoming) {
          return { inputs: [], inputKeys: [], inputKeysWithValues: [] };
        }
        const inputs = flatten(
          compact(this.incoming.map(x => x.socialOutputDefinition))
        );
        const toStrings = ary => ary.map(x => (Array.isArray(x) ? x[0] : x));
        return {
          inputs,
          inputKeys: toStrings(inputs),
          inputKeysWithValues: toStrings(inputs.filter(x => Array.isArray(x)))
        };
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
