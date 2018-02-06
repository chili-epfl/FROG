// @flow

import { extendObservable, observable, computed, action } from 'mobx';
import cuid from 'cuid';

import { store } from './index';
import Elem from './elemClass';
import { timeToPx, timeToPxScreen, between } from '../utils';
import type { AnchorT } from '../utils/path';
import { calculateBounds } from './activityStore';
import type { BoundsT } from './store';

export default class Activity extends Elem {
  constructor(
    plane: number,
    startTime: number,
    title: string,
    length: number,
    id: ?string,
    state: ?string
  ) {
    super();
    extendObservable(this, {
      id: id || cuid(),
      over: false, // is mouse over this activity
      plane: plane,
      rawTitle: title || '',
      length: length,
      startTime: startTime,
      klass: 'activity',
      state: state,
      wasMoved: false,

      update: action((newact: $Shape<Activity>) => {
        this.length = newact.length;
        this.startTime = newact.startTime;
        this.rawTitle = newact.title;
        this.state = newact.state;
      }),

      rename: action((newname: string) => {
        this.rawTitle = newname;
        store.addHistory();
      }),

      move: action(() => {
        if (store.state.mode === 'readOnly') {
          return;
        }
        if (store.state.mode !== 'moving') {
          store.state = {
            mode: 'moving',
            currentActivity: this,
            initialStartTime: this.startTime,
            mouseOffset: store.ui.socialCoordsTime[0] - this.startTime
          };
          this.wasMoved = true;
        }

        const state = store.state;
        const newTime = Math.round(
          store.ui.socialCoordsTime[0] - state.mouseOffset
        );
        if (store.overlapAllowed) {
          this.startTime = between(
            0,
            store.graphDuration - this.length,
            newTime
          );
        } else {
          this.startTime = between(
            this.bounds.leftBoundTime,
            this.bounds.rightBoundTime - this.length,
            newTime
          );

          const overdrag =
            store.ui.socialCoordsTime[0] - state.mouseOffset - this.startTime;

          if (overdrag < -2 && this.bounds.leftBoundActivity) {
            store.activityStore.swapActivities(
              this.bounds.leftBoundActivity,
              this
            );
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
      }),

      resize: action(() => {
        const state = store.state;
        if (state.mode === 'resizing') {
          const newTime = Math.round(store.ui.socialCoordsTime[0]);
          const max = store.overlapAllowed
            ? store.graphDuration
            : state.bounds.rightBoundTime;
          this.length = between(
            1,
            max - this.startTime,
            newTime - this.startTime
          );
        }
      }),

      onLeave: action(() => {
        this.over = false;
      }),

      onOver: action(() => {
        const state = store.state;
        if (state.mode !== 'waitingDrag') {
          this.over = true;
        }
      }),

      setRename: action(() => {
        store.state = {
          mode: 'rename',
          currentActivity: this,
          val: this.title
        };
      }),

      get title(): string {
        if (store.ui.isSvg) {
          return `${store.activityStore.activitySequence[this.id]}: ${
            this.rawTitle
          }`;
        } else {
          return this.rawTitle;
        }
      },

      get xScaled(): number {
        return timeToPx(this.startTime, store.ui.scale);
      },

      get x(): number {
        return timeToPx(this.startTime, 4);
      },

      get screenX(): number {
        return timeToPxScreen(this.startTime);
      },

      get widthScaled(): number {
        return timeToPx(this.length, store.ui.scale);
      },

      get width(): number {
        return timeToPx(this.length, 4);
      },

      get y(): number {
        const offset = store.activityStore.activityOffsets[this.id];
        return (4 - this.plane) * 100 + 50 - offset * 30;
      },

      get endTime(): number {
        return this.startTime + this.length;
      },

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
      },

      get dragPointFromScaled(): AnchorT {
        return {
          X: this.xScaled + this.widthScaled - 15,
          Y: this.y + 15,
          dX: 50,
          dY: 0
        };
      },

      get dragPointToScaled(): AnchorT {
        return {
          X: this.xScaled + 15,
          Y: this.y + 15,
          dX: -50,
          dY: 0
        };
      },

      get dragPointFrom(): AnchorT {
        return {
          X: this.x + this.width - 15,
          Y: this.y + 15,
          dX: 50,
          dY: 0
        };
      },

      get dragPointTo(): AnchorT {
        return {
          X: this.x + 15,
          Y: this.y + 15,
          dX: -50,
          dY: 0
        };
      },

      get bounds(): BoundsT {
        return calculateBounds(this, store.activityStore.all);
      }
    });
  }
}
