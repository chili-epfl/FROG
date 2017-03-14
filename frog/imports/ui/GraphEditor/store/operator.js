// @flow
import cuid from 'cuid';
import { observable, action, computed } from 'mobx';
import { store } from './index';
import Elem from './elemClass';
import { pxToTime, timeToPx } from '../utils';

export default class Operator extends Elem {
  id: string;
  type: string;
  klass: string;
  @observable y: number;
  @observable over: boolean;
  @observable time: number;
  @action init(time: number, y: number, type: string, id: ?string) {
    this.time = time;
    this.y = y;
    this.id = id || cuid();
    this.type = type;
    this.klass = 'operator';
  }

  constructor(time: number, y: number, type: string, id: ?string) {
    super();
    this.init(time, y, type, id);
  }

  @computed get x(): number {
    return timeToPx(this.time, 1);
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

  @action onOver = (): true => this.over = true;
  @action onLeave = (): false => this.over = false;

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
    }
  };

  @action moveX = (deltaX: number): void => {
    this.time += pxToTime(deltaX, store.ui.scale);
  };

  @action stopDragging = (): void => {
    if (store.state.mode === 'movingOperator') {
      store.state = { mode: 'normal' };
      store.addHistory();
    } else {
      store.connectionStore.stopDragging();
    }
  };

  @computed get object(): {
    _id: string,
    time: number,
    y: number,
    type: string
  } {
    return {
      _id: this.id,
      time: this.time,
      y: this.y,
      type: this.type
    };
  }

  @computed get dragPointTo(): [number, number] {
    // operator has size of 60, finding midpoint
    return [this.x + 25, this.y + 25];
  }

  @computed get dragPointFrom(): [number, number] {
    return this.dragPointTo;
  }

  @computed get dragPointToScaled(): [number, number] {
    // operator has size of 60, finding midpoint
    return [this.xScaled + 25, this.y + 25];
  }

  @computed get dragPointFromScaled(): [number, number] {
    return this.dragPointToScaled;
  }

  @action update = (newopt: $Shape<Operator>) => {
    this.time = newopt.time;
    this.y = newopt.y;
  };
}
