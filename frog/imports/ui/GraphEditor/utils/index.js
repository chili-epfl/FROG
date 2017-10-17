// @flow
import { store } from '../store';

export const timeToPx = (time: number, scale: number): number =>
  time * store.ui.graphWidth * scale / store.graphDuration;

export const pxToTime = (px: number, scale: number): number =>
  px / store.ui.graphWidth / scale * store.graphDuration;

export const timeToPxScreen = (time: number): number =>
  time * store.ui.graphWidth * store.ui.scale / store.graphDuration -
  store.ui.panx * store.ui.scale;

export const between = (
  minval: number = 0,
  maxval: number = 9999999,
  x: number
): number => Math.min(Math.max(x, minval), maxval);

// from https://github.com/facebook/react/issues/3185
export const getClickHandler = (
  onClick: Function,
  onDblClick: Function,
  delay: number = 250
): any => {
  let timeoutID = null;
  return event => {
    event.preventDefault();
    if (!timeoutID) {
      timeoutID = window.setTimeout(() => {
        onClick(event);
        timeoutID = null;
      }, delay);
    } else {
      timeoutID = window.clearTimeout(timeoutID);
      onDblClick(event);
    }
  };
};

// only allows positive ranges
export const rangeExclusive = (start: number, end: number) =>
  [...Array(end - start).keys()].map(x => start + x);
