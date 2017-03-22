// @flow
import { action, observable, computed } from 'mobx';
import { between, timeToPx, pxToTime } from '../utils';
import { store } from './index';
import type { Elem } from './store';
import Operator from './operator';

export default class uiStore {
  @observable panx: number;
  @observable scale: number;
  @observable selected: ?Elem;
  @observable showModal: Boolean;
  @observable graphWidth: number = 1000;

  @action changeGraphWidth = (newWidth: number) => {
    this.graphWidth = newWidth;
  };

  rawMouseToTime = (rawX: number, rawY: number): [number, number] => {
    const x = pxToTime(rawX, this.scale) + this.panTime;
    const y = rawY;
    return [x, y];
  };

  @action unselect() {
    this.selected = null;
  }

  @action setModal = (set: Boolean) => {
    this.showModal = set;
  };

  @action cancelAll = () => {
    this.selected = undefined;
    store.state = { mode: 'normal' };
  };

  @computed get panOffset(): number {
    return this.panx * 4 * this.scale;
  }

  @action setScaleDelta = (x: number): void => {
    this.setScale(this.scale + x);
  };

  @action setScale = (x: number): void => {
    const oldscale = this.scale;
    this.scale = between(0.4, 3, x);

    const oldPanBoxSize = 250 / oldscale;
    const newPanBoxSize = 250 / this.scale;
    const needPanDelta = oldPanBoxSize / 2 - newPanBoxSize / 2;

    this.panDelta(needPanDelta);
  };

  @action canvasClick = () => {
    const state = store.state;
    if (state.mode === 'placingOperator') {
      store.operatorStore.all.push(
        new Operator(...this.socialCoordsTime, state.operatorType)
      );
      store.state = { mode: 'normal' };
      store.addHistory();
    }
    store.state = { mode: 'normal' };
  };

  @observable scrollIntervalID: ?string;
  @action storeInterval = (interval: string) => {
    this.scrollIntervalID = interval;
  };

  @action cancelScroll = () => {
    if (this.scrollIntervalID) {
      window.clearInterval(this.scrollIntervalID);
    }
    this.scrollIntervalID = undefined;
  };

  @action panDelta = (deltaX: number): void => {
    const oldpan = this.panx;
    const panBoxSize = 250 / this.scale;
    const rightBoundary = 1000 - panBoxSize;

    const newPan = this.panx + deltaX;
    this.panx = between(0, rightBoundary, newPan);
    const moveDelta = (this.panx - oldpan) * 4 * this.scale;
    const state = store.state;
    if (oldpan !== this.panx) {
      if (state.mode === 'resizing') {
        const oldlength = state.currentActivity.length;
        state.currentActivity.resize(moveDelta);
        if (oldlength === state.currentActivity.length) {
          this.panx = oldpan;
        }
      }
      if (state.mode === 'moving') {
        const oldStartTime = state.currentActivity.startTime;
        state.currentActivity.move(moveDelta);
        if (oldStartTime === state.currentActivity.startTime) {
          this.panx = oldpan;
        }
      }
      if (state.mode === 'movingOperator') {
        state.currentOperator.moveX(moveDelta);
      }
    }
  };

  @observable socialCoordsTime: [number, number] = [0, 0];

  @computed get scrollEnabled(): boolean {
    return !!['movingOperator', 'dragging', 'moving', 'resizing'].includes(
      store.state.mode
    );
  }

  @action socialMove = (rawX: number, rawY: number): void => {
    this.socialCoordsTime = this.rawMouseToTime(rawX, rawY);
  };

  @computed get socialCoords(): [number, number] {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, 1);
    return [x, y];
  }

  @computed get socialCoordsScaled(): [number, number] {
    const [rawX, y] = this.socialCoordsTime;
    const x = timeToPx(rawX, this.scale);
    return [x, y];
  }

  @computed get panTime(): number {
    return this.panx / 8.12;
  }

  @computed get rightEdgeTime(): number {
    return this.panTime + 31 / this.scale;
  }
  @observable scale = 1;

  @observable panx = 0;
}
