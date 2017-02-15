// @flow
import { action, observable, computed } from 'mobx';
import { between, timeToPx, pxToTime } from '../utils';
import { store } from './index';
import * as constants from '../constants';
import type { Elem } from './store'

export default class uiStore {
  @observable panx: number;
  @observable scale: number;
  @observable selected: ?Elem;

  @action unselect() {
    this.selected = null
  }
  
  rawMouseToTime = (rawX: number, rawY: number): [number, number] => {
    const x = pxToTime(rawX - constants.GRAPH_LEFT, this.scale) + this.panTime;
    const y = rawY - constants.GRAPH_TOP;
    return [x, y];
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

  @action canvasClick = (e: any) => {
    if (store.state.mode === 'placingOperator') {
      const coords = this.rawMouseToTime(
        e.nativeEvent.offsetX,
        e.nativeEvent.offsetY
      );
      // this.operators.push(new Operator(
      //   coords[0],
      //   coords[1],
      //   this.operatorType
      // ));
      // this.mode = { mode: 'normal' };
      // this.addHistory();
      // }
      // this.renameOpen = null;
    }
  };

  @observable scrollIntervalID: ?string;
  @action storeInterval = (interval: string) => {
    this.scrollIntervalID = interval;
  };
  @action cancelScroll = () => {
    if (this.scrollIntervalId) {
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
    // if (oldpan !== this.panx) {
    //   if (this.mode === 'dragging') {
    //     this.dragCoords[0] += deltaX * 4 * this.scale;
    //   }
    //   if (this.mode === 'resizing') {
    //     const oldlength = this.mode.currentActivity.length;
    //     this.mode.currentActivity.resize(deltaX * 4 * this.scale);
    //     if (oldlength === store.mode.currentActivity.length) {
    //       this.panx = oldpan;
    //     }
    //   }
    //   if (this.mode === 'moving') {
    //     const oldx = this.mode.currentActivity.x;
    //     this.mode.currentActivity.move(deltaX * 4 * this.scale);
    //     if (oldx === this.mode.currentActivity.x) {
    //       this.panx = oldpan;
    //     }
    //   }
    // }
  };

  @observable socialCoordsTime: [number, number] = [0, 0];

  @computed get scrollEnabled(): boolean {
    return !!['dragging', 'moving', 'resizing'].includes(store.state.mode);
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
