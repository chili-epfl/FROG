// @flow

import { extendObservable, action } from 'mobx';
import cuid from 'cuid';
import { debounce } from 'lodash';

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

  data: Object;

  dataDelayed: Object;

  setDataDelayed: Object => void;

  setDataDelayedNow: Object => void;

  debouncedSetDataDelayed: Object => void;

  activityType: string;

  rawTitle: string;

  wasMoved: boolean;

  title: string;

  bounds: BoundsT;

  endTime: number;

  plane: number;

  update: ($Shape<Activity>) => void;

  rename: string => void;

  move: (?boolean) => void;

  push: number => void;

  setStart: number => void;

  setLength: number => void;

  resize: (?boolean) => void;

  state: any;

  onLeave: () => void;

  onOver: () => void;

  setRename: () => void;

  title: string;

  xScaled: number;

  x: number;

  screenX: number;

  widthScaled: number;

  width: number;

  y: number;

  endTime: number;

  object: {
    _id: string,
    title: string,
    startTime: number,
    length: number,
    plane: number
  };

  dragPointFromScaled: AnchorT;

  dragPointToScaled: AnchorT;

  dragPointFrom: AnchorT;

  dragPointTo: AnchorT;

  bounds: BoundsT;

  strokeColor: string;

  constructor(
    plane: number,
    startTime: number,
    title: string,
    length: number,
    data: ?Object,
    activityType: ?string,
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
      data: data || {},
      dataDelayed: data || {},
      activityType,
      wasMoved: false,

      setDataDelayedNow: action((config: Object) => {
        this.dataDelayed = config;
      }),

      update: action((newact: $Shape<Activity>) => {
        this.length = newact.length;
        this.startTime = newact.startTime;
        this.rawTitle = newact.title;
        this.state = newact.state;
        this.data = newact.data;
        this.plane = newact.plane;
        this.activityType = newact.activityType;
        this.debouncedSetDataDelayed(newact.data);
        const elem = document.getElementById('configForm');
        if (elem) {
          elem.focus();
        }
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

        const activitiesToPush = shiftkey
          ? store.activityStore.all.filter(
              x => x.startTime >= this.startTime && x.id !== this.id
            )
          : [];
        const operatorsToPush = shiftkey
          ? store.operatorStore.all.filter(x => x.time >= this.startTime)
          : [];

        const oldTime = this.startTime;
        const newTime = Math.round(
          store.ui.socialCoordsTime[0] - store.state.mouseOffset
        );
        if (store.overlapAllowed) {
          this.startTime = between(
            0,
            store.graphDuration - this.length,
            newTime
          );

          const diff = newTime - oldTime;
          if (diff !== 0) {
            activitiesToPush.forEach(x => x.push(diff));
            operatorsToPush.forEach(x => x.push(diff));
          }
        } else {
          this.startTime = between(
            this.bounds.leftBoundTime,
            this.bounds.rightBoundTime - this.length,
            newTime
          );
          if (store.state.mode !== 'moving') {
            return;
          }

          const overdrag =
            store.ui.socialCoordsTime[0] -
            store.state.mouseOffset -
            this.startTime;

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

      setStart: action(x => {
        this.startTime = x;
      }),

      setLength: action(x => {
        this.length = x;
      }),

      resize: action((shiftkey: boolean) => {
        if (store.state.mode === 'resizing') {
          const { bounds } = store.state;
          const activitiesToPush = shiftkey
            ? store.activityStore.all.filter(
                x => x.startTime > this.startTime && x.id !== this.id
              )
            : [];
          const operatorsToPush = shiftkey
            ? store.operatorStore.all.filter(x => x.time >= this.startTime)
            : [];
          const newTime = Math.round(store.ui.socialCoordsTime[0]);
          const max = store.overlapAllowed
            ? store.graphDuration
            : bounds.rightBoundTime;
          const oldLength = this.length;
          this.length = between(
            1,
            max - this.startTime,
            newTime - this.startTime
          );
          const diff = this.length - oldLength;
          if (diff !== 0) {
            activitiesToPush.forEach(x => x.push(diff));
            operatorsToPush.forEach(x => x.push(diff));
          }
        }
        store.activityStore.emptySizes();
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
        return 300 * (1 - this.plane / 4) - 14 - offset * 30;
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
        // + 15 on Y because the activity box is 30px high
        // - 10 on X to be on top of the activity connection dot
        return {
          X: this.xScaled + this.widthScaled - 10,
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

  setDataDelayed = (config: Object) => {
    this.setDataDelayedNow(config);
  };

  debouncedSetDataDelayed = debounce(this.setDataDelayed, 1000);
}
