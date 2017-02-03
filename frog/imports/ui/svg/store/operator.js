// @flow
import cuid from 'cuid';
import { observable, action, computed } from 'mobx';
import { store } from './index';
import { pxToTime, timeToPx } from '../utils';

export default class Operator {
  id: string;
  type: string;
  @observable selected: boolean;
  @observable y: number;
  @observable over: boolean;
  @observable time: number;
  @action init(time: number, y: number, type: string, id: string) {
    this.time = time;
    this.y = y;
    this.id = id || cuid();
    this.type = type;
  }

  constructor(time: number, y: number, type: string, id: string) {
    this.init(time, y, type, id);
  }

  @computed get x(): number {
    return timeToPx(this.time, 1);
  }

  @computed get xScaled(): number {
    return timeToPx(this.time, store.scale);
  }

  @computed get coordsScaled(): [number, number] {
    return [this.xScaled, this.y];
  }

  @computed get coords(): [number, number] {
    return [this.x, this.y];
  }

  @action onClick = (): void => {
    store.unselect();
    this.selected = true;
  };

  @action onOver = (): true => this.over = true;
  @action onLeave = (): false => this.over = false;
  @computed get highlighted(): boolean {
    return this.over &&
      store.draggingFromActivity !== this &&
      store.mode === 'dragging';
  }

  @action startDragging = (e: { shiftKey: boolean }): void => {
    if (!e.shiftKey) {
      store.startDragging(this);
    }
  };

  @action onDrag = (
    e: { shiftKey: boolean },
    { deltaX, deltaY }: { deltaX: number, deltaY: number }
  ) => {
    if (!e.shiftKey) {
      store.dragging(deltaX, deltaY);
    } else {
      this.time += pxToTime(deltaX, store.scale);
      this.y += deltaY;
    }
  };

  @action stopDragging = (e: { shiftKey: boolean }): void => {
    if (!e.shiftKey) {
      store.stopDragging();
    }
    store.addHistory();
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

  @computed get dragPoint(): [number, number] {
    return [this.xScaled + 30, this.y + 30];
  }

  @action update = (newopt: $Shape<Operator>) => {
    this.time = newopt.time;
    this.y = newopt.y;
  };
}
