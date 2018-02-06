// @flow
import cuid from 'cuid';
import { extendObservable, observable, action, computed } from 'mobx';
import { store } from './index';
import Elem from './elemClass';
import { pxToTime, timeToPx } from '../utils';
import type { AnchorT } from '../utils/path';

export default class Operator extends Elem {
  constructor(
    time: number,
    y: number,
    type: string,
    id: ?string,
    title: ?string,
    state: ?string
  ) {
    super();

    extendObservable(this, {
      time: time,
      y: y,
      id: id || cuid(),
      type: type,
      klass: 'operator',
      title: title,
      state: state,

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
        // operator has size of 60, finding midpoint
        return {
          X: this.x + 25,
          Y: this.y + 25,
          dX: -150,
          dY: 0
        };
      },

      get dragPointToScaled(): AnchorT {
        // operator has size of 60, finding midpoint
        return {
          X: this.xScaled + 25,
          Y: this.y + 25,
          dX: -150,
          dY: 0
        };
      },

      get dragPointFrom(): AnchorT {
        // operator has size of 60, finding midpoint
        return {
          X: this.x + 25,
          Y: this.y + 25,
          dX: 150,
          dY: 0
        };
      },

      get dragPointFromScaled(): AnchorT {
        // operator has size of 60, finding midpoint
        return {
          X: this.xScaled + 25,
          Y: this.y + 25,
          dX: 150,
          dY: 0
        };
      }
    });
  }
}
