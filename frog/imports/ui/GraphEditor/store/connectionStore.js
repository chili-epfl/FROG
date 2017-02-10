import { computed, action, observable } from 'mobx';

import { store } from './store';
import Connection from './connection';

export default class ConnectionStore {
  @observable all: Array<Connection> = [];

  @action dragging = (deltax: number, deltay: number): void => {
    this.dragCoords = [
      this.dragCoords[0] + deltax,
      this.dragCoords[1] + deltay
    ];
  };

  // user begins dragging a line to make a connection
  @action startDragging = (activity: Activity | Operator): void => {
    this.mode = { mode: 'dragging', draggingFrom: activity };
    let coords;
    if (activity instanceof Activity) {
      coords = [activity.xScaled + activity.widthScaled - 10, activity.y + 15];
    } else {
      // operator
      coords = [activity.xScaled + 30, activity.y + 30];
    }
    this.draggingFrom = [...coords];
    this.dragCoords = [...coords];
  };

  @computed get dragPath(): ?string {
    return this.mode === 'dragging'
      ? drawPath(...this.draggingFrom, ...this.dragCoords)
      : null;
  }
  @action stopDragging = () => {
    this.mode = { mode: 'normal' };
    const targetAry = this.activities
      .filter(x => x.over)
      .concat(this.operators.filter(x => x.over));
    if (
      targetAry.length > 0 && this.draggingFromActivity.id !== targetAry[0].id
    ) {
      this.connections.push(new Connection(
        this.draggingFromActivity,
        targetAry[0]
      ));
      this.addHistory();
    }
    this.cancelScroll();
  };

  @action mongoAdd = x => {
    if (!this.findId({ type: 'connection', id: x._id })) {
      this.connections.push(new Connection(
        this.findId(x.source),
        this.findId(x.target),
        x._id
      ));
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

  // mouse pointer during line connection dragging
  @action connectDragDelta = (xdelta: number, ydelta: number): void => {
    this.dragCoords = [xdelta, ydelta];
  };

  // user has dropped line somewhere, clear out
  @action connectStop = () => {
    this.mode = { mode: 'normal' };
    this.cancelScroll();
    this.dragCoords = [];
  };
}
