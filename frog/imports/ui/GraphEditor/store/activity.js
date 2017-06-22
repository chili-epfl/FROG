// @flow

import { observable, computed, action } from 'mobx';
import cuid from 'cuid';
import { store } from './index';
import Elem from './elemClass';
import { timeToPx, timeToPxScreen, between } from '../utils';
import type { AnchorT } from '../utils/path';
import { calculateBounds } from './activityStore';
import type { BoundsT } from './store';

export default class Activity extends Elem {
  @action
  init = (
    plane: number,
    startTime: number,
    title: string,
    length: number,
    id: ?string,
    state: ?string
  ) => {
    this.id = id || cuid();
    this.over = false; // is mouse over this activity
    this.plane = plane;
    this.title = title || '';
    this.length = length;
    this.startTime = startTime;
    this.klass = 'activity';
    this.state = state;
  };

  constructor(
    plane: number,
    startTime: number,
    title: string,
    length: number,
    id: ?string,
    state: ?string
  ) {
    super();
    this.init(plane, startTime, title, length, id, state);
  }

  plane: number;
  klass: 'activity' | 'operator' | 'connection';
  id: string;
  @observable over: boolean;
  @observable title: string;
  @observable length: number;
  @observable startTime: number;
  @observable wasMoved: boolean = false;
  @observable state: ?string;

  @computed
  get xScaled(): number {
    return timeToPx(this.startTime, store.ui.scale);
  }
  @computed
  get x(): number {
    return timeToPx(this.startTime, 4);
  }
  @computed
  get screenX(): number {
    return timeToPxScreen(this.startTime);
  }

  @computed
  get widthScaled(): number {
    return timeToPx(this.length, store.ui.scale);
  }
  @computed
  get width(): number {
    return timeToPx(this.length, 4);
  }

  @action
  update = (newact: $Shape<Activity>) => {
    this.length = newact.length;
    this.startTime = newact.startTime;
    this.title = newact.title;
    this.state = newact.state;
  };

  @action
  rename = (newname: string) => {
    this.title = newname;
    store.addHistory();
  };

  @action
  move = () => {
    if (store.state.mode === 'readOnly') {
      return;
    }
    if (store.state.mode !== 'moving') {
      store.state = {
        mode: 'moving',
        currentActivity: this,
        mouseOffset: store.ui.socialCoordsTime[0] - this.startTime
      };
      this.wasMoved = true;
    }

    const state = store.state;
    const newTime = Math.round(
      store.ui.socialCoordsTime[0] - state.mouseOffset
    );
    if (store.overlapAllowed) {
      this.startTime = between(0, store.graphDuration - this.length, newTime);
    } else {
      this.startTime = between(
        this.bounds.leftBoundTime,
        this.bounds.rightBoundTime - this.length,
        newTime
      );

      const overdrag =
        store.ui.socialCoordsTime[0] - state.mouseOffset - this.startTime;

      if (overdrag < -2 && this.bounds.leftBoundActivity) {
        store.activityStore.swapActivities(this.bounds.leftBoundActivity, this);
        store.state = { mode: 'waitingDrag' };
      }

      if (overdrag > 2 && this.bounds.rightBoundActivity) {
        store.activityStore.swapActivities(
          this,
          this.bounds.rightBoundActivity
        );
        store.state = { mode: 'waitingDrag' };
      }
    }
  };

  @action
  resize() {
    const state = store.state;
    if (state.mode === 'resizing') {
      const newTime = Math.round(store.ui.socialCoordsTime[0]);
      const max = store.overlapAllowed
        ? store.graphDuration
        : state.bounds.rightBoundTime;
      this.length = between(1, max - this.startTime, newTime - this.startTime);
    }
  }

  @action
  onLeave = () => {
    this.over = false;
  };

  @action
  onOver = () => {
    const state = store.state;
    if (state.mode !== 'waitingDrag') {
      this.over = true;
    }
  };

  @action onLeave = () => (this.over = false);

  @action
  setRename = () => {
    store.state = {
      mode: 'rename',
      currentActivity: this,
      val: this.title
    };
  };

  @computed
  get y(): number {
    const offset = store.activityStore.activityOffsets[this.id];
    return (4 - this.plane) * 100 + 50 - offset * 30;
  }

  @computed
  get endTime(): number {
    return this.startTime + this.length;
  }

  @computed
  get object(): {
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

  @computed
  get dragPointFromScaled(): AnchorT {
    return {
      X: this.xScaled + this.widthScaled - 15,
      Y: this.y + 15,
      dX: 50,
      dY: 0
    };
  }

  @computed
  get dragPointToScaled(): AnchorT {
    return {
      X: this.xScaled + 15,
      Y: this.y + 15,
      dX: -50,
      dY: 0
    };
  }

  @computed
  get dragPointFrom(): AnchorT {
    return {
      X: this.x + this.width - 15,
      Y: this.y + 15,
      dX: 50,
      dY: 0
    };
  }

  @computed
  get dragPointTo(): AnchorT {
    return {
      X: this.x + 15,
      Y: this.y + 15,
      dX: -50,
      dY: 0
    };
  }

  @computed
  get bounds(): BoundsT {
    return calculateBounds(this, store.activityStore.all);
  }
}
