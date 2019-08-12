// @flow
import * as React from 'react';
import { isEmpty } from 'lodash';

import { Activities } from '/imports/api/activities';
import { getActivitySequence } from '/imports/api/graphSequence';
import Steps from './Steps';

const StepsController = ({ activities, openActivities }) => {
  const sequence = getActivitySequence(activities);
  // const placeInSeq = !isEmpty(openActivities) ? sequence[openActivities[0]] : 0;
  const maxSeq = Object.keys(sequence).reduce(
    (acc, x) => (sequence[x] > acc ? sequence[x] : acc),
    0
  );

  const steps = [];
  for (let i = 0; i < maxSeq; i++) {
    const acts = Object.keys(sequence).filter(id => sequence[id] === i);
    if (!isEmpty(acts)) {
      const actString = acts
        .map(x => Activities.findOne(x).title)
        .join(' and ');

      steps.push({
        title: actString,
        _id: acts[0],
        status: Activities.findOne(acts[0]).state
      });
    }
  }

  console.log(steps);
  return <Steps activities={steps} />;
};

export default StepsController;
