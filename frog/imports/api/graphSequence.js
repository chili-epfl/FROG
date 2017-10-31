// @flow

import { type ActivityDbT } from 'frog-utils';

export const calculateNextOpen = (
  timeInGraph: number,
  activities: ActivityDbT[]
): [number, ActivityDbT[]] => {
  const [t0, t1] = [
    ...new Set(
      [
        ...activities.map(a => a.startTime),
        ...activities.map(a => a.startTime + a.length)
      ].filter(t => t > timeInGraph)
    )
  ]
    .sort((a, b) => a - b)
    .slice(0, 2);
  const newTimeInGraph = t1 ? (t0 + t1) / 2 : -1;

  const openActivities = activities.filter(
    a =>
      a.startTime <= newTimeInGraph && a.startTime + a.length > newTimeInGraph
  );
  return [newTimeInGraph, openActivities];
};

export const getActivitySequence = (
  activities: ActivityDbT[]
): { [string]: number } => {
  let timeInGraph;
  const activitySeq = {};
  let c = 0;
  while (timeInGraph !== -1) {
    c += 1;
    const [nt, open] = calculateNextOpen(timeInGraph || -1, activities);
    // eslint-disable-next-line no-loop-func
    open.forEach(x => (activitySeq[x._id] = c));
    timeInGraph = nt;
  }
  return activitySeq;
};
