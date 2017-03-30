// @flow
import { action, observable, computed, autorun } from 'mobx';
import { between, timeToPx, pxToTime } from '../utils';
import { store } from './index';
import type { Elem } from './store';
import Operator from './operator';

export default class uiStore {
  constructor() {
    autorun(() => {
      if (this.selected) {
        this.setStickySelected(this.selected);
      }
    });
  }

  @observable panx: number = 0;
  @observable scale: number = 4;
  @observable selected: ?Elem;
  @observable stickySelected: ?Elem;
  @observable showModal: Boolean;
  @observable graphWidth: number = 1000;

  @computed get panBoxSize(): number {
    return this.graphWidth / this.scale;
  }

  @action changeGraphWidth = (newWidth: number) => {
    this.graphWidth = newWidth;
    // avoids the pan box to bcome out of bounds when resizing the graph editor
    this.panDelta(0);
  };

  rawMouseToTime = (rawX: number, rawY: number): [number, number] => {
    const x = pxToTime(rawX, this.scale) + this.panTime;
    const y = rawY;
    return [x, y];
  };

  @action setStickySelected = (x: ?Elem) => this.stickySelected = x;

  @action unselect() {
    this.selected = null;
  }

  @action setModal = (set: Boolean) => {
    this.showModal = set;
  };

  @action cancelAll = () => {
    this.selected = undefined;
    store.state = { mode: 'normal' };
    store.addHistory();
  };

  @computed get panOffset(): number {
    return this.panx * this.scale;
  }

  @action setScaleDelta = (x: number): void => {
    this.setScaleValue(this.scale * (1 - 0.1 * Math.sign(x)));
  };

  @action setScaleValue = (newScale: value): void => {
    this.scale = between(1, 8, newScale);
    this.panDelta(0);
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
    const rightBoundary = this.graphWidth - this.panBoxSize;

    const newPan = this.panx + deltaX;

    this.panx = between(0, rightBoundary, newPan);

    const moveDelta = (this.panx - oldpan) * this.scale;
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
    return pxToTime(this.panOffset, this.scale);
  }

  @computed get rightEdgeTime(): number {
    return pxToTime(this.panOffset + this.panBoxSize * this.scale, this.scale);
  }
}
