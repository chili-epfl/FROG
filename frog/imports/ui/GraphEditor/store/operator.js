// @flow
import cuid from 'cuid';
import { observable, action, computed } from 'mobx';
import { store } from './index';
import Elem from './elemClass';
import { pxToTime, timeToPx } from '../utils';

export default class Operator extends Elem {
  id: string;
  type: string;
  @observable y: number;
  @observable over: boolean;
  @observable time: number;
  @action init(time: number, y: number, type: string, id: ?string) {
    this.time = time;
    this.y = y;
    this.id = id || cuid();
    this.type = type;
    this.store = store.operatorStore;
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
    return [this.x + 30, this.y + 30];
  }

  @computed get dragPointFrom(): [number, number] {
    return this.dragPointTo;
  }

  @computed get dragPointToScaled(): [number, number] {
    return [this.xScaled + 30, this.y + 30];
  }

  @computed get dragPointFromScaled(): [number, number] {
    return this.dragPointToScaled;
  }

  @action update = (newopt: $Shape<Operator>) => {
    this.time = newopt.time;
    this.y = newopt.y;
  };
}
