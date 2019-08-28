// @flow

import { isEmpty } from 'lodash';

import { Activities } from '/imports/api/activities';
import { getActivitySequence } from '/imports/api/graphSequence';

type SessionStep = {
  title: string,
  _id: string,
  status: 'pending' | 'active' | 'completed'
};

const generateSteps = (session: Object, activities: Object): SessionStep[] => {
  if (session === undefined || activities === undefined) return [];

  const openActivities = session.openActivities;
  const timeInGraph = session.timeInGraph;
  const sequence = getActivitySequence(activities);

  // Either we are on an activity, or we are either at the beginning or end of the sequence
  const placeInSeq = !isEmpty(openActivities)
    ? sequence[openActivities[0]]
    : timeInGraph > 1 || Number.isNaN(timeInGraph)
    ? 999
    : 0;
  const maxSeq = Object.keys(sequence).reduce(
    (acc, x) => (sequence[x] > acc ? sequence[x] : acc),
    0
  );

  const steps = [];
  for (let i = 0; i <= maxSeq; i++) {
    const acts = Object.keys(sequence).filter(id => sequence[id] === i);
    if (!isEmpty(acts)) {
      const actString = acts
        .map(x => Activities.findOne(x).title)
        .join(' and ');
      let status = 'pending';
      if (openActivities.includes(acts[0])) {
        status = 'active';
      }
      if (
        sequence[acts[0]] < placeInSeq ||
        (openActivities.length === 0 && timeInGraph > 0)
      ) {
        status = 'completed';
      }
      steps.push({
        title: actString,
        _id: acts[0],
        status
      });
    }
  }
  return steps;
};

export const steps = (session: Object, activities: Object) => ({
  steps: generateSteps(session, activities)
});
