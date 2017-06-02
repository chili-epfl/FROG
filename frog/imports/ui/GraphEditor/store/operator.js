// @flow
import cuid from 'cuid';
import { observable, action, computed } from 'mobx';
import { store } from './index';
import Elem from './elemClass';
import { pxToTime, timeToPx } from '../utils';
import type { AnchorT } from '../utils/path';

export default class Operator extends Elem {
  id: string;
  type: string;
  klass: string;
  @observable y: number;
  @observable title: ?string;
  @observable over: boolean;
  @observable time: number;
  @observable wasMoved: boolean = false;

  @action init(
    time: number,
    y: number,
    type: string,
    id: ?string,
    title: ?string
  ) {
    this.time = time;
    this.y = y;
    this.id = id || cuid();
    this.type = type;
    this.klass = 'operator';
    this.title = title;
  }

  constructor(
    time: number,
    y: number,
    type: string,
    id: ?string,
    title: ?string
  ) {
    super();
    this.init(time, y, type, id, title);
  }

  @computed get x(): number {
    return timeToPx(this.time, 4);
  }

  @computed get xScaled(): number {
    return timeToPx(this.time, store.ui.scale);
  }

  @computed get coordsScaled(): [number, number] {
    return [this.xScaled, this.y];
  }

  @computed get coords(): [number, number] {
    return [this.x, this.y];
  }

  @action rename = (newname: string) => {
    this.title = newname;
    store.addHistory();
  };

  @action onOver = (): true => (this.over = true);
  @action onLeave = (): false => (this.over = false);

  @action startDragging = (e: { shiftKey: boolean }): void => {
    if (!e.shiftKey) {
      store.connectionStore.startDragging(this);
    } else {
      store.state = { mode: 'movingOperator', currentOperator: this };
    }
  };

  @action onDrag = (
    e: { shiftKey: boolean },
    { deltaX, deltaY }: { deltaX: number, deltaY: number }
  ) => {
    if (store.state.mode === 'movingOperator') {
      this.time += pxToTime(deltaX, store.ui.scale);
      this.y += deltaY;
      this.wasMoved = true;
    }
  };

  @action moveX = (deltaX: number): void => {
    this.time += pxToTime(deltaX, store.ui.scale);
    this.wasMoved = true;
  };

  @action stopDragging = (): void => {
    if (store.state.mode === 'movingOperator') {
      store.state = { mode: 'normal' };
      store.addHistory();
    } else {
      store.connectionStore.stopDragging();
    }
    store.ui.cancelScroll();
  };

  @computed get object(): {
    _id: string,
    time: number,
    y: number,
    type: string,
    title: ?string
  } {
    return {
      _id: this.id,
      time: this.time,
      y: this.y,
      type: this.type,
      title: this.title
    };
  }

  @computed get dragPointTo(): AnchorT {
    // operator has size of 60, finding midpoint
    return {
      X: this.x + 25,
      Y: this.y + 25,
      dX: -150,
      dY: 0
    };
  }

  @computed get dragPointFrom(): AnchorT {
    // operator has size of 60, finding midpoint
    return {
      X: this.x + 25,
      Y: this.y + 25,
      dX: 150,
      dY: 0
    };
  }

  @computed get dragPointToScaled(): AnchorT {
    // operator has size of 60, finding midpoint
    return {
      X: this.xScaled + 25,
      Y: this.y + 25,
      dX: -150,
      dY: 0
    };
  }

  @computed get dragPointFromScaled(): AnchorT {
    // operator has size of 60, finding midpoint
    return {
      X: this.xScaled + 25,
      Y: this.y + 25,
      dX: 150,
      dY: 0
    };
  }

  @action update = (newopt: $Shape<Operator>) => {
    this.time = newopt.time;
    this.y = newopt.y;
  };
}
