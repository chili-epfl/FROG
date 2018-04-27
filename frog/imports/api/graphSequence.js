// @flow

import { type ActivityDbT } from 'frog-utils';
import { Graphs } from './graphs';
import { Sessions } from './sessions';

export const calculateNextOpen = (
  timeInGraph: number,
  activities: ActivityDbT[],
  sessionId?: string
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
  if (t1) {
    const newTimeInGraph = (t0 + t1) / 2;

    const openActivities = activities.filter(
      a =>
        a.startTime <= newTimeInGraph && a.startTime + a.length > newTimeInGraph
    );
    return [newTimeInGraph, openActivities];
  } else {
    if (!sessionId) {
      return [-1, []];
    }
    const graph = Graphs.findOne(Sessions.findOne(sessionId).graphId);
    const newTime =
      (Math.max(...activities.map(x => x.startTime + x.length)) +
        graph.duration) /
      2;
    return [newTime, []];
  }
};

export const getActivitySequence = (
  activities: ActivityDbT[]
): { [string]: number } => {
  let timeInGraph;
  const activitySeq = {};
  let c = 0;
  while (timeInGraph !== -1) {
    c += 1;
    const [_, open] = calculateNextOpen(timeInGraph || -1, activities);
    // eslint-disable-next-line no-loop-func
    open.forEach(x => {
      if (!activitySeq[x._id]) {
        activitySeq[x._id] = c;
      }
    });
  }
  return activitySeq;
};
