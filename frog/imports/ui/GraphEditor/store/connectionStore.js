// @flow
import { computed, action, observable } from 'mobx';

import { store } from './index';
import Activity from './activity';
import Connection from './connection';
import { drawPath } from '../utils/path';

export default class ConnectionStore {
  @observable all: Array<Connection> = [];

  // user begins dragging a line to make a connection
  @action startDragging = (elem: Activity | Operator): void => {
    store.state = { mode: 'dragging', draggingFrom: elem };
  };

  @computed get dragPath(): ?string {
    if (store.state.mode !== 'dragging') {
      return null;
    }
    return drawPath(
      ...store.state.draggingFrom.dragPointFrom,
      ...store.ui.socialCoordsScaled
    );
  }

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
      store.addHistory();
    }
    store.state = { mode: 'normal' };
    store.ui.cancelScroll();
  };

  @action mongoAdd = x => {
    if (!this.findId({ type: 'connection', id: x._id })) {
      this.connections.push(
        new Connection(this.findId(x.source), this.findId(x.target), x._id)
      );
    }
  };
  @action mongoRemove = remact => {
    this.connections = this.connections.filter(x => x.id !== remact._id);
  };

  @computed get mongoObservers() {
    return {
      added: this.mongoAdd,
      removed: this.mongoRemove
    };
  }

  @computed get history(): Array<any> {
    return this.all.map(x => ({ ...x }));
  }

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = { mode: 'normal' };
    this.cancelScroll();
    this.dragCoords = [];
  };
}
