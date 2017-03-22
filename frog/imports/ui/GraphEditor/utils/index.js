// @flow
import { store } from '../store';

export const timeToPx = (time: number, scale: number): number =>
  time * store.ui.graphWidth * scale / 120;

export const pxToTime = (px: number, scale: number): number =>
  px / store.ui.graphWidth / scale * 120;

export const timeToPxScreen = (time: number): number =>
  time * store.ui.graphWidth * store.ui.scale / 120 -
  store.ui.panx * store.ui.scale;

export const between = (
  minval: number = 0,
  maxval: number = 9999999,
  x: number
): number => Math.min(Math.max(x, minval), maxval);
