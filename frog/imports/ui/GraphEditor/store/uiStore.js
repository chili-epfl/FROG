// @flow
import { action, observable, computed, reaction } from 'mobx';
import { between, timeToPx, pxToTime } from '../utils';
import { store } from './index';
import type { Elem } from './store';
import Operator from './operator';

export default class uiStore {
  constructor() {
    reaction(
      () => [Boolean(this.selected), this.windowWidth],
      () => this.updateGraphWidth()
    );
  }

  timeToRaw = (coords: [number, number]): [number, number] => [
    timeToPx(coords[0] - this.panTime, this.scale),
    coords[1]
  ];

  @observable svgRef: any = null;
  @observable panx: number = 0;
  @observable scale: number = 4;
  @observable selected: ?Elem;
  @observable showModal: Boolean;
  @observable windowWidth: number = 1000;
  @observable graphWidth: number = 1000;
  @observable socialCoordsTime: [number, number] = [0, 0];

  @computed get panBoxSize(): number {
    return this.graphWidth / this.scale;
  }

  @action setSvgRef = (ref: any) => this.svgRef = ref;

  @action setGraphWidth(x: number) {
    this.graphWidth = x;
  }

  @action updateGraphWidth() {
    const oldPan = this.panTime;
    const boxWidth = this.selected && this.selected.klass !== 'connection'
      ? 500
      : 0;
    this.graphWidth = this.windowWidth - boxWidth;
    this.panx = timeToPx(oldPan, this.scale) / this.scale;
  }

  @action updateWindow = () => {
    this.windowWidth = window.innerWidth - 10;
    this.panDelta(0);
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
    store.addHistory();
  };

  @computed get panOffset(): number {
    return this.panx * this.scale;
  }

  @action setScaleDelta = (x: number): void => {
    this.setScaleValue(this.scale * (1 - 0.1 * Math.sign(x)));
  };

  @action setScaleValue = (newScale: number): void => {
    this.scale = between(1, store.graphDuration / 15, newScale);
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
    store.ui.selected = null;
  };

  @action endRename() {
    store.state = { mode: 'normal' };
  }

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

  @action panDelta = (rawX: number): void => {
    const deltaX = rawX * 2;
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
        this.socialPan(moveDelta);
        if (oldlength === state.currentActivity.length) {
          this.panx = oldpan;
        }
      }
      if (state.mode === 'movingOperator') {
        state.currentOperator.moveX(moveDelta);
        this.socialPan(moveDelta);
      }
    }
    if (state.mode === 'moving') {
      state.currentActivity.move(moveDelta);
      this.socialPan(moveDelta);
    }
    if (state.mode === 'dragging') {
      this.socialPan(moveDelta);
    }
  };

  @computed get scrollEnabled(): boolean {
    return !!['movingOperator', 'dragging', 'moving', 'resizing'].includes(
      store.state.mode
    );
  }

  @action socialPan = (deltaX: number): void => {
    const current = this.timeToRaw(this.socialCoordsTime);
    const newCoords = [current[0] + deltaX, current[1]];
    this.socialMove(...newCoords);
  };

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
