// @flow

import { extendObservable, action } from 'mobx';

import { type ElementTypes } from './store';
import { store } from './index';
import Activity from './activity';
import Operator from './operator';
import Connection from './connection';
import { drawPath } from '../utils/path';

type MongoConnectionT = {
  source: { type: ElementTypes, id: string },
  target: { type: ElementTypes, id: string },
  _id: string
};

export default class ConnectionStore {
  all: Connection[];
  history: Object[];
  startDragging: (Activity | Operator) => void;
  stopDragging: () => void;
  dragPath: string;
  mongoAdd: MongoConnectionT => void;
  mongoRemove: MongoConnectionT => void;
  cleanDangling: () => void;

  constructor() {
    extendObservable(this, {
      all: [],

      startDragging: action((elem: Activity | Operator) => {
        store.state = { mode: 'dragging', draggingFrom: elem };
      }),

      cleanDangling: action(() => {
        const elems = store.activityStore.all.concat(store.operatorStore.all);
        this.all = this.all.filter(
          x => elems.includes(x.source) && elems.includes(x.target)
        );
      }),

      stopDragging: action(() => {
        const state = store.state;
        if (state.mode !== 'dragging') {
          return;
        }
        const target = store.activityStore.all
          .concat(store.operatorStore.all)
          .find(x => x.over);
        if (target && state.draggingFrom.id !== target.id) {
          this.all.push(
            new Connection(
              { type: state.draggingFrom.klass, id: state.draggingFrom.id },
              { type: target.klass, id: target.id }
            )
          );
          target.wasMoved = true;
          store.addHistory();
        }
        store.state = { mode: 'normal' };
        store.ui.cancelScroll();
      }),

      mongoAdd: action((x: MongoConnectionT) => {
        if (!store.findId({ type: 'connection', id: x._id })) {
          this.all.push(new Connection(x.source, x.target, x._id));
          store.refreshValidate();
        }
      }),

      mongoRemove: action((remact: MongoConnectionT) => {
        this.all = this.all.filter(x => x.id !== remact._id);
        store.refreshValidate();
      }),

      // user begins dragging a line to make a connection
      get dragPath(): ?string {
        if (store.state.mode !== 'dragging') {
          return null;
        }
        return drawPath({
          dragging: true,
          source: store.state.draggingFrom.dragPointFromScaled,
          target: {
            X: store.ui.socialCoordsScaled[0],
            Y: store.ui.socialCoordsScaled[1],
            dX: 0,
            dY: 0
          }
        });
      },

      get history(): Array<any> {
        return this.all.map(x => ({
          id: x.id,
          source: { type: x.source.klass, id: x.source.id },
          target: { type: x.target.klass, id: x.target.id }
        }));
      }
    });
  }
}
