// @flow
import { observable, computed, action } from 'mobx';
import cuid from 'cuid';
import { store } from './index';
import Elem from './elemClass';
import { timeToPx, pxToTime, timeToPxScreen, between } from '../utils';
import { calculateBounds } from './activityStore';
import type { BoundsT } from './store';

export default class Activity extends Elem {
  @action init = (
    plane: number,
    startTime: number,
    title: string,
    length: number,
    id: ?string
  ) => {
    this.id = id || cuid();
    this.over = false; // is mouse over this activity
    this.overdrag = 0;
    this.plane = plane;
    this.title = title || '';
    this.length = length;
    this.startTime = startTime;
    this.klass = 'activity';
  };

  constructor(
    plane: number,
    startTime: number,
    title: string,
    length: number,
    id: ?string
  ) {
    super();
    this.init(plane, startTime, title, length, id);
  }

  plane: number;
  klass: string;
  id: string;
  @observable over: boolean;
  @observable overdrag: number;
  @observable title: string;
  @observable length: number;
  @observable startTime: number;

  @computed get xScaled(): number {
    return timeToPx(Math.floor(this.startTime), store.ui.scale);
  }
  @computed get x(): number {
    return timeToPx(Math.floor(this.startTime), 1);
  }
  @computed get screenX(): number {
    return timeToPxScreen(Math.floor(this.startTime), 1);
  }

  @computed get widthScaled(): number {
    return timeToPx(Math.floor(this.length), store.ui.scale);
  }
  @computed get width(): number {
    return timeToPx(Math.floor(this.length), 1);
  }

  @action update = (newact: $Shape<Activity>) => {
    this.length = newact.length;
    this.startTime = newact.startTime;
    this.title = newact.title;
  };

  @action rename = (newname: string) => {
    this.title = newname;
    store.addHistory();
    store.ui.cancelAll();
  };

  @action move = (deltax: number) => {
    const state = store.state;
    if (state.mode === 'moving') {
      const deltaTime = pxToTime(deltax, store.ui.scale);
      if (store.overlapAllowed) {
        this.startTime = between(
          0,
          120 - this.length,
          this.startTime + deltaTime
        );
      } else {
        const oldTime = this.startTime;
        this.startTime = between(
          state.bounds.leftBoundTime,
          state.bounds.rightBoundTime - this.length,
          this.startTime + deltaTime
        );
        if (oldTime === this.startTime && Math.abs(deltaTime) !== 0) {
          this.overdrag += deltaTime;
          if (this.overdrag < -3 && state.bounds.leftBoundActivity) {
            store.activityStore.swapActivities(
              state.bounds.leftBoundActivity,
              this
            );
            store.activityStore.stopMoving();
          }
          if (this.overdrag > 3 && state.bounds.rightBoundActivity) {
            store.activityStore.swapActivities(
              this,
              state.bounds.rightBoundActivity
            );
            this.overdrag = 0;
            store.activityStore.stopMoving();
          }
        }
      }
    }
  };

  @action resize(deltax: number) {
    const state = store.state;
    if (state.mode === 'resizing') {
      const deltaTime = pxToTime(deltax, store.ui.scale);
      this.length = between(
        1,
        state.bounds.rightBoundTime - this.startTime,
        this.length + deltaTime
      );
    }
  }

  @action onOver = () => this.over = true;

  @action onLeave = () => {
    this.over = false;
  };

  @action setRename = () => {
    store.state = {
      mode: 'rename',
      currentActivity: this
    };
  };

  @computed get y(): number {
    const offset = store.activityStore.activityOffsets[this.id];
    return this.plane * 100 + 50 - offset * 30;
  }

  @computed get endTime(): number {
    return this.startTime + this.length;
  }

  @computed get object(): {
    _id: string,
    title: string,
    startTime: number,
    length: number,
    plane: number
  } {
    return {
      _id: this.id,
      title: this.title,
      startTime: this.startTime,
      length: this.length,
      plane: this.plane
    };
  }

  @computed get dragPointFromScaled(): [number, number] {
    return [this.xScaled + this.widthScaled - 15, this.y + 15];
  }

  @computed get dragPointToScaled(): [number, number] {
    return [this.xScaled + 15, this.y + 15];
  }

  @computed get dragPointFrom(): [number, number] {
    return [this.x + this.width - 15, this.y + 15];
  }

  @computed get dragPointTo(): [number, number] {
    return [this.x + 15, this.y + 15];
  }

  @computed get bounds(): BoundsT {
    return calculateBounds(this, store.activityStore.all);
  }
}
