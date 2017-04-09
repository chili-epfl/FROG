// @flow
import { computed, action, observable } from 'mobx';

import { store } from './index';
import Activity from './activity';
import Operator from './operator';
import Connection from './connection';
import { drawPath } from '../utils/path';

type MongoConnection = Connection & { _id: string };

export default class ConnectionStore {
  @observable all: Array<Connection> = [];

  // user begins dragging a line to make a connection
  @computed get dragPath(): ?string {
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
  }

  @action startDragging = (elem: Activity | Operator): void => {
    store.state = { mode: 'dragging', draggingFrom: elem };
  };

  @action stopDragging = () => {
    const state = store.state;
    if (state.mode !== 'dragging') {
      return;
    }
    const target = store.activityStore.all
      .concat(store.operatorStore.all)
      .find(x => x.over);
    if (target && state.draggingFrom.id !== target.id) {
      this.all.push(new Connection(state.draggingFrom, target));
      target.wasMoved = true;
      store.addHistory();
    }
    store.state = { mode: 'normal' };
    store.ui.cancelScroll();
  };

  @action cleanDangling = (): void => {
    const elems = store.activityStore.all.concat(store.operatorStore.all);
    this.all = this.all.filter(
      x => elems.includes(x.source) && elems.includes(x.target)
    );
  };

  @action mongoAdd = (x: MongoConnection) => {
    if (!store.findId({ type: 'connection', id: x._id })) {
      this.all.push(
        new Connection(store.findId(x.source), store.findId(x.target), x._id)
      );
    }
  };
  @action mongoRemove = (remact: MongoConnection): void => {
    this.all = this.all.filter(x => x.id !== remact._id);
  };

  @computed get mongoObservers(): any {
    return {
      added: this.mongoAdd,
      removed: this.mongoRemove
    };
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({
      id: x.id,
      source: { type: x.source.klass, id: x.source.id },
      target: { type: x.target.klass, id: x.target.id }
    }));
  }
}
