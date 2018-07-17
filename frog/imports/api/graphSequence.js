// @flow

import { type ActivityDbT } from 'frog-utils';
import { Graphs } from './graphs';
import { Sessions } from './sessions';

export const calculateNextOpen = (
  timeInGraph: number,
  activities: ActivityDbT[],
  sessionId?: string
): [number, ActivityDbT[], boolean] => {
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
    return [newTimeInGraph, openActivities, false];
  } else {
    if (!sessionId) {
      return [-1, [], true];
    }
    const graph = Graphs.findOne(Sessions.findOne(sessionId).graphId);
    const newTime =
      (Math.max(...activities.map(x => x.startTime + x.length)) +
        graph.duration) /
      2;
    return [newTime, [], true];
  }
};

export const getActivitySequence = (
  activities: ActivityDbT[]
): { [string]: number } => {
  let timeInGraph = -1;
  const activitySeq = {};
  let c = 0;
  while (true) {
    c += 1;
    const [nt, open, final] = calculateNextOpen(timeInGraph, activities);
    // eslint-disable-next-line no-loop-func
    if (final) {
      break;
    }
    // eslint-disable-next-line no-loop-func
    open.forEach(x => {
      if (!activitySeq[x._id]) {
        activitySeq[x._id] = c;
      }
    });
    timeInGraph = nt;
  }
  return activitySeq;
};
