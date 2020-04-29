// @flow

import { extendObservable, action } from 'mobx';
import * as Sentry from '@sentry/browser';
import { store } from './index';
import Activity from './activity';

export default class Elem {
  selected: boolean;

  color: string;

  select: () => void;

  klass: 'activity' | 'operator' | 'connection';

  id: string;

  wasMoved: boolean;

  remove: boolean => void;

  title: string;

  constructor() {
    extendObservable(this, {
      select: action(() => {
        Sentry.addBreadcrumb({
          category: 'graph',
          message: 'Selected ' + this.klass,
          data: { class: this.klass, id: this.id, title: this.title }
        });
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
        const { activityStore, operatorStore, connectionStore } = store;
        const filter = x => x !== this;
        if (this.klass === 'activity') {
          activityStore.all = activityStore.all.filter(filter);
        } else if (this.klass === 'operator') {
          operatorStore.all = operatorStore.all.filter(filter);
        } else {
          connectionStore.all = connectionStore.all.filter(filter);
        }
        if (shift && this instanceof Activity) {
          activityStore.moveDelete(this);
        }
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
          return '#CCEEEA';
        }
        switch (this.state) {
          case 'computing':
            return '#E8D77E';
          case 'computed':
            return '#CCEEEA';
          case 'error':
            return '#E04E4E';
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
          return '#626B75';
        }
        if (errors.find(x => x.type === 'missingType')) {
          return '#D9E5F0';
        }
        return '#E04E4E';
      }
    });
  }
}
