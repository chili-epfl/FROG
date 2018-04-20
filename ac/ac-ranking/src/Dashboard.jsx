// @flow

import { CoordinatesDashboard, ProgressDashboard } from 'frog-utils';

export const getXYFromRanking = (answers: Object, config: Object) => {
  // the hardcoded coordinates of each option
  const coordinates = [[8, 8], [8, -8], [-8, 8], [-8, -8]];
  // the weights attributed to each ranked option for a weighted average
  const weights = [6, 3, 1, 0];

  const { x, y, w } = config.answers.reduce(
    (acc, option, idx) => {
      const [ox, oy] = coordinates[idx % 4];
      const rk = answers[option];
      const _w = rk && rk < 4 ? weights[rk - 1] : 0;
      return { x: acc.x + _w * ox, y: acc.y + _w * oy, w: acc.w + _w };
    },
    { x: 0, y: 0, w: 0 }
  );

  const noZeroW = w < 1 ? 1 : w;
  return { x: x / noZeroW, y: y / noZeroW };
};

export default {
  progress: ProgressDashboard,
  coordinates: CoordinatesDashboard
};
