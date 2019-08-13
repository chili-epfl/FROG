// @flow
import * as React from 'react';
import { isEmpty } from 'lodash';

import { Activities } from '/imports/api/activities';
import { getActivitySequence } from '/imports/api/graphSequence';
import Steps from './Steps';

const StepsContainer = ({
  session,
  activities,
  openActivities,
  timeInGraph
}) => {
  const sequence = getActivitySequence(activities);

  // Either we are on an activity, or we are either at the beginning or end of the sequence
  const placeInSeq = !isEmpty(openActivities)
    ? sequence[openActivities[0]]
    : timeInGraph > 1
    ? 999
    : 0;
  const maxSeq = Object.keys(sequence).reduce(
    (acc, x) => (sequence[x] > acc ? sequence[x] : acc),
    0
  );

  const steps = [];
  for (let i = 0; i < maxSeq + 1; i++) {
    const acts = Object.keys(sequence).filter(id => sequence[id] === i);
    if (!isEmpty(acts)) {
      const actString = acts
        .map(x => Activities.findOne(x).title)
        .join(' and ');
      let status = 'pending';
      if (openActivities.includes(acts[0])) {
        status = 'active';
      }
      if (sequence[acts[0]] < placeInSeq) {
        status = 'completed';
      }
      steps.push({
        title: actString,
        _id: acts[0],
        status
      });
    }
  }

  return <Steps steps={steps} />;
};

export default StepsContainer;
