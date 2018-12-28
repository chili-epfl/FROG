// @flow

import { Meteor } from 'meteor/meteor';
import { extendObservable, action, reaction } from 'mobx';

import { type ActivityDbT } from 'frog-utils';

import { getActivitySequence } from 'imports/api/graphSequence';
import changelog from 'imports/api/changelog';
import { between, timeToPx, pxToTime } from '../utils';
import { store } from './index';
import Elem from './elemClass';

export default class uiStore {
  setLibraryOpen: boolean => void;
  selected: ?Elem;
  setIsSvg: boolean => void;
  isSvg: boolean;
  panx: number;
  panBoxSize: number;
  scale: number;
  socialPan: number => void;
  socialCoordsTime: [number, number];
  panDelta: number => void;
  scrollIntervalID: any;
  updateWindow: () => void;
  windowWidth: number;
  storeInterval: any => void;
  cancelScroll: () => void;
  setShowInfo: ('activity' | 'operator', string) => void;
  showInfo: ?{ klass: 'activity' | 'operator', id: string };
  svgRef: any;
  setShowErrors: boolean | (string => void);
  showErrors: boolean | string;
  socialCoords: [number, number];
  socialCoordsScaled: [number, number];
  panTime: number;
  rightEdgeTime: number;
  furthestObject: number;
  setScaleDelta: number => void;
  setScaleValue: number => void;
  canvasClick: () => void;
  endRename: () => void;
  socialMove: (number, number) => void;
  scrollEnabled: boolean;
  panOffset: number;
  setSvgRef: any => void;
  svgRef: any;
  setShowPreview: (?Object) => void;
  showPreview: ?Object;
  setSidepanelOpen: boolean => void;
  sidepanelOpen: boolean;
  toggleSidepanelOpen: () => void;
  setLibraryOpen: boolean => void;
  libraryOpen: boolean;
  setShowChangelogModal: boolean => void;
  showChangelogModal: boolean;
  setShowHelpModal: boolean => void;
  showHelpModal: boolean;
  updateGraphWidth: () => void;
  setGraphWidth: number => void;
  graphWidth: number;
  cancelAll: () => void;
  unselect: () => void;

  constructor() {
    const user = Meteor.user();

    extendObservable(this, {
      sidepanelOpen: false,
      svgRef: null,
      scale: 1,
      windowWidth: 1000,
      graphWidth: 1000,
      socialCoordsTime: [0, 0],
      showErrors: false,
      isSvg: false,
      panx: 0,
      scrollIntervalID: '',
      selected: undefined,
      showPreview: false,
      libraryOpen: false,
      showInfo: false,
      showChangelogModal:
        user?.profile?.lastVersionChangelog !== undefined &&
        user?.profile.lastVersionChangelog < changelog.length - 1,
      showHelpModal: false,
      setIsSvg: action((isSvg: boolean) => {
        this.isSvg = isSvg;
        if (isSvg) {
          store.activityStore.setActivitySequence(
            getActivitySequence(
              store.activityStore.all.map(x => {
                const acObj: ActivityDbT = {
                  data: x.data,
                  startTime: x.startTime,
                  length: x.length,
                  activityType: x.activityType,
                  _id: x.id
                };
                return acObj;
              })
            )
          );
        }
      }),

      panDelta: action((deltaX: number) => {
        const oldpan = this.panx;
        const rightBoundary = this.graphWidth - this.panBoxSize;

        const newPan = this.panx + deltaX;

        this.panx = between(0, rightBoundary, newPan);

        const moveDelta = (this.panx - oldpan) * this.scale;
        const state = store.state;

        if (oldpan !== this.panx) {
          if (state.mode === 'resizing') {
            const oldlength = state.currentActivity.length;
            state.currentActivity.resize();
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
          state.currentActivity.move();
          this.socialPan(moveDelta);
        }
        if (state.mode === 'dragging') {
          this.socialPan(moveDelta);
        }
      }),

      get graphErrorColor(): string {
        const error = store.graphErrors.filter(x => x.severity === 'error');
        const warning = store.graphErrors.filter(x => x.severity === 'warning');
        if (error.length > 0) {
          return 'red';
        }
        if (warning.length > 0) {
          return 'yellow';
        }
        return 'green';
      },

      setShowErrors: action((toSet: boolean | string) => {
        this.showErrors = toSet;
      }),

      setShowInfo: action((klass: 'activity' | 'operator', id: string) => {
        this.showInfo = { klass, id };
      }),

      setShowPreview: action((x: ?Object) => {
        this.showPreview = x;
      }),

      setLibraryOpen: action((x: boolean) => {
        this.libraryOpen = x;
      }),

      cancelInfo: action(() => {
        this.showInfo = null;
      }),

      setSidepanelOpen: action((x: boolean) => {
        this.sidepanelOpen = x;
      }),

      toggleSidepanelOpen: action(() => {
        this.sidepanelOpen = !this.sidepanelOpen;
      }),

      get panBoxSize(): number {
        return this.graphWidth / this.scale;
      },

      setSvgRef: action((ref: any) => {
        this.svgRef = ref;
      }),

      setGraphWidth: action((x: number) => {
        this.graphWidth = x;
      }),

      updateGraphWidth: action(() => {
        const oldPan = this.panTime;
        const boxWidth = this.sidepanelOpen ? 500 : 0;
        this.graphWidth = this.windowWidth - boxWidth;
        this.panx = timeToPx(oldPan, this.scale) / this.scale;
      }),

      updateWindow: action(() => {
        this.windowWidth = window.innerWidth;
        this.panDelta(0);
      }),

      unselect: action(() => {
        this.selected = null;
      }),

      setShowChangelogModal: action((set: boolean) => {
        this.showChangelogModal = set;
      }),

      setShowHelpModal: action((set: boolean) => {
        this.showHelpModal = set;
      }),

      cancelAll: action(() => {
        this.selected = undefined;
        store.state = { mode: 'normal' };
        store.addHistory();
      }),

      get panOffset(): number {
        return this.panx * this.scale;
      },

      setScaleDelta: action((x: number) => {
        this.setScaleValue(this.scale * (1 - 0.1 * Math.sign(x)));
      }),

      setScaleValue: action((newScale: number) => {
        this.scale = between(1, store.graphDuration / 10, newScale);
        this.panDelta(0);
      }),

      canvasClick: action(() => {
        store.state = { mode: 'normal' };
        store.ui.selected = null;
      }),

      endRename: action(() => {
        store.state = { mode: 'normal' };
      }),

      storeInterval: action((interval: string) => {
        this.scrollIntervalID = interval;
      }),

      cancelScroll: action(() => {
        if (this.scrollIntervalID) {
          clearInterval(this.scrollIntervalID);
        }
        this.scrollIntervalID = undefined;
      }),

      get scrollEnabled() {
        return !!['movingOperator', 'dragging', 'moving', 'resizing'].includes(
          store.state.mode
        );
      },

      socialPan: action((deltaX: number) => {
        const current = this.timeToRaw(this.socialCoordsTime);
        const newCoords = [current[0] + deltaX, current[1]];
        this.socialMove(...newCoords);
      }),

      socialMove: action((rawX: number, rawY: number) => {
        this.socialCoordsTime = this.rawMouseToTime(rawX, rawY);
      }),

      get socialCoords(): [number, number] {
        const [rawX, y] = this.socialCoordsTime;
        const x = timeToPx(rawX, 1);
        return [x, y];
      },

      get socialCoordsScaled(): [number, number] {
        const [rawX, y] = this.socialCoordsTime;
        const x = timeToPx(rawX, this.scale);
        return [x, y];
      },

      get panTime(): number {
        return pxToTime(this.panOffset, this.scale);
      },

      get rightEdgeTime(): number {
        return pxToTime(
          this.panOffset + this.panBoxSize * this.scale,
          this.scale
        );
      },

      get furthestObject(): number {
        return Math.ceil(
          Math.max(
            store.operatorStore.furthestOperator || 0,
            store.activityStore.furthestActivity || 0,
            30
          )
        );
      }
    });

    reaction(
      () => [this.sidepanelOpen, this.windowWidth],
      () => this.updateGraphWidth()
    );
  }

  timeToRaw = (coords: [number, number]): [number, number] => [
    timeToPx(coords[0] - this.panTime, this.scale),
    coords[1]
  ];

  rawMouseToTime = (rawX: number, rawY: number): [number, number] => {
    const x = pxToTime(rawX, this.scale) + this.panTime;
    const y = rawY;
    return [x, y];
  };
}
