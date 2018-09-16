// @flow

import cuid from 'cuid';
import { extendObservable, action } from 'mobx';
import { store } from './index';
import Elem from './elemClass';
import { pxToTime, timeToPx } from '../utils';
import type { AnchorT } from '../utils/path';

export default class Operator extends Elem {
  rename: string => void;
  onOver: () => void;
  onLeave: () => void;
  startDragging: ({ shiftKey: boolean }) => void;
  onDrag: ({ shiftKey: boolean }, { deltaX: number, deltaY: number }) => void;
  moveX: number => void;
  push: number => void;
  stopDragging: () => void;
  update: ($Shape<Operator>) => void;
  x: number;
  xScaled: number;
  coordsScaled: [number, number];
  coords: [number, number];
  object: {
    _id: string,
    time: number,
    y: number,
    type: string,
    title: ?string
  };
  dragPointTo: AnchorT;
  dragPointToScaled: AnchorT;
  dragPointFrom: AnchorT;
  dragPointFromScaled: AnchorT;
  time: number;
  title: string;
  over: boolean;
  data: Object;
  operatorType: string;
  y: number;
  type: string;
  strokeColor: string;
  highlighted: boolean;

  constructor(
    time: number,
    y: number,
    type: string,
    data: ?Object,
    operatorType: ?string,
    id: ?string,
    title: ?string,
    state: ?string
  ) {
    super();

    extendObservable(this, {
      time,
      y,
      id: id || cuid(),
      type,
      klass: 'operator',
      title,
      state,
      data: data || {},
      operatorType,
      over: false,

      rename: action((newname: string) => {
        this.title = newname;
        store.addHistory();
      }),

      onOver: action(() => {
        this.over = true;
      }),

      onLeave: action(() => {
        this.over = false;
      }),

      startDragging: action((e: { shiftKey: boolean }) => {
        if (!e.shiftKey) {
          store.connectionStore.startDragging(this);
        } else {
          store.state = { mode: 'movingOperator', currentOperator: this };
        }
      }),

      onDrag: action(
        (
          e: { shiftKey: boolean },
          { deltaX, deltaY }: { deltaX: number, deltaY: number }
        ) => {
          if (store.state.mode === 'movingOperator') {
            this.time += pxToTime(deltaX, store.ui.scale);
            this.y += deltaY;
            this.wasMoved = true;
          }
        }
      ),

      moveX: action((deltaX: number) => {
        this.time += pxToTime(deltaX, store.ui.scale);
        this.wasMoved = true;
      }),

      push: action((diff: number) => {
        this.time += diff;
      }),

      stopDragging: action(() => {
        if (store.state.mode === 'movingOperator') {
          store.state = { mode: 'normal' };
          store.addHistory();
        } else {
          store.connectionStore.stopDragging();
        }
        store.ui.cancelScroll();
      }),

      update: action((newopt: $Shape<Operator>) => {
        this.time = newopt.time;
        this.y = newopt.y;
        this.title = newopt.title;
        this.data = newopt.data;
        this.operatorType = newopt.operatorType;
      }),

      get x(): number {
        return timeToPx(this.time, 4);
      },

      get xScaled(): number {
        return timeToPx(this.time, store.ui.scale);
      },

      get coordsScaled(): [number, number] {
        return [this.xScaled, this.y];
      },

      get coords(): [number, number] {
        return [this.x, this.y];
      },

      get object(): {
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
      },

      get dragPointTo(): AnchorT {
        return {
          X: this.x,
          Y: this.y,
          dX: -150,
          dY: 0
        };
      },

      get dragPointToScaled(): AnchorT {
        return {
          X: this.xScaled,
          Y: this.y,
          dX: -150,
          dY: 0
        };
      },

      get dragPointFrom(): AnchorT {
        return {
          X: this.x,
          Y: this.y,
          dX: 150,
          dY: 0
        };
      },

      get dragPointFromScaled(): AnchorT {
        return {
          X: this.xScaled,
          Y: this.y,
          dX: 150,
          dY: 0
        };
      }
    });
  }
}
