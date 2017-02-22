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
    this.mode = { mode: 'normal' };
    const targetAry = this.activities
      .filter(x => x.over)
      .concat(this.operators.filter(x => x.over));
    if (
      targetAry.length > 0 && this.draggingFromActivity.id !== targetAry[0].id
    ) {
      this.connections.push(
        new Connection(this.draggingFromActivity, targetAry[0])
      );
      this.addHistory();
    }
    this.cancelScroll();
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
