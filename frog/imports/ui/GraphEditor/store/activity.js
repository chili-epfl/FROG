import { extendObservable, action } from 'mobx';
import cuid from 'cuid';

import { store } from './index';
import Elem from './elemClass';
import { timeToPx, timeToPxScreen, between } from '../utils';
import type { AnchorT } from '../utils/path';
import { calculateBounds } from './activityStore';
import type { BoundsT } from './store';

export default class Activity extends Elem {
  length: number;
  startTime: number;
  id: string;
  over: boolean;
  rawTitle: string;
  klass: string;
  state: string;
  wasMoved: boolean;
  title: string;
  bounds: BoundsT;
  endTime: number;

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
      plane,
      rawTitle: title || '',
      length,
      startTime,
      klass: 'activity',
      state,
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

      move: action(shiftkey => {
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
        if (shiftkey && !store.state.activitiesToPush) {
          store.state = {
            ...store.state,
            activitiesToPush: store.activityStore.all.filter(
              x => x.startTime >= this.startTime && x.id !== this.id
            )
          };
        }

        const _state = store.state;
        const oldTime = this.startTime;
        const newTime = Math.round(
          store.ui.socialCoordsTime[0] - _state.mouseOffset
        );
        if (store.overlapAllowed) {
          this.startTime = between(
            0,
            store.graphDuration - this.length,
            newTime
          );

          const diff = newTime - oldTime;
          if (diff !== 0 && store.state.activitiesToPush) {
            store.state.activitiesToPush.forEach(x => x.push(diff));
          }
        } else {
          this.startTime = between(
            this.bounds.leftBoundTime,
            this.bounds.rightBoundTime - this.length,
            newTime
          );

          const overdrag =
            store.ui.socialCoordsTime[0] - _state.mouseOffset - this.startTime;

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

      push: action(diff => {
        this.startTime = between(
          0,
          store.graphDuration - this.length,
          this.startTime + diff
        );
      }),

      resize: action(shiftkey => {
        const _state = store.state;
        if (_state.mode === 'resizing') {
          if (shiftkey && !store.state.activitiesToPush) {
            store.state = {
              ...store.state,
              activitiesToPush: store.activityStore.all.filter(
                x => x.startTime > this.startTime && x.id !== this.id
              )
            };
          }
          const newTime = Math.round(store.ui.socialCoordsTime[0]);
          const max = store.overlapAllowed
            ? store.graphDuration
            : _state.bounds.rightBoundTime;
          const oldLength = this.length;
          this.length = between(
            1,
            max - this.startTime,
            newTime - this.startTime
          );
          const diff = this.length - oldLength;
          if (diff !== 0 && store.state.activitiesToPush) {
            store.state.activitiesToPush.forEach(x => x.push(diff));
          }
        }
      }),

      onLeave: action(() => {
        this.over = false;
      }),

      onOver: action(() => {
        const _state = store.state;
        if (_state.mode !== 'waitingDrag') {
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
        return (5 - this.plane) * 100 + 50 - offset * 30;
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
