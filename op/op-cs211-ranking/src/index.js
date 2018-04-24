// @flow

import {
  type productOperatorT,
  values,
  entries,
  wrapUnitAll
} from 'frog-utils';
import { compact } from 'lodash';
import Stringify from 'json-stringify-pretty-compact';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  required: ['individual', 'group', 'groupData'],
  properties: {
    individual: { type: 'sourceActivity', title: 'Individual classification' },
    group: { type: 'sourceActivity', title: 'Group classification' },
    groupData: {
      type: 'sourceActivity',
      title: 'Group classification with data'
    }
  }
};

const aryToObj = ary => compact(ary).reduce((acc, x) => ({ ...acc, ...x }), {});

const extractGroup = (data, title) => {
  if (!data) {
    throw `No ${title} activity data`;
  }
  const raw = values(data.payload).map(
    x => x && x.data && x.data.completed && x.data.answers
  );

  const nonCompletion = raw.filter(x => x === undefined).length;

  return [nonCompletion, aryToObj(raw)];
};

const transitionMatrix = (first, second) =>
  entries(first).reduce(
    (acc: { notCompleted: number }, [k, v]) => {
      if (!second[k]) {
        return { ...acc, notCompleted: acc.notCompleted + 1 };
      }
      const firsttop = entries(v).find(([_, rank]) => rank === 1);
      const secondtop = entries(second[k]).find(([_, rank]) => rank === 1);
      if (!firsttop || !secondtop) {
        return { ...acc, notCompleted: acc.notCompleted + 1 };
      }

      if (!acc[firsttop[0]]) {
        acc[firsttop[0]] = {};
      }

      if (!acc[firsttop[0]][secondtop[0]]) {
        acc[firsttop[0]][secondtop[0]] = 1;
      } else {
        acc[firsttop[0]][secondtop[0]] += 1;
      }
      return acc;
    },
    { notCompleted: 0 }
  );

const operator = (configData, object) => {
  const individual = object.activityData[configData.individual];
  if (!individual) {
    throw 'No individual activity data';
  }

  const first = aryToObj(
    values(individual.payload).map(x => x && x.data && x.data.answers)
  );

  // console.log(individual);
  const [secondNonCompletion, second] = extractGroup(
    object.activityData[configData.group],
    'group'
  );
  const [thirdNonCompletion, third] = extractGroup(
    object.activityData[configData.groupData],
    'groupData'
  );
  const transitionFirstSecond = transitionMatrix(first, second);
  const transitionSecondThird = transitionMatrix(second, third);

  const result = `Result:

Not completing second activity: ${secondNonCompletion}
Not completing third activity: ${thirdNonCompletion}

Transition matrix first->second activity:
${Stringify(transitionFirstSecond)}


Transition matrix second->third activity:
${Stringify(transitionSecondThird)}
`;
  return wrapUnitAll({}, { text: result });
};

export default ({
  id: 'op-cs211-ranking',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
