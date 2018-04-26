// @flow

import {
  type productOperatorT,
  values,
  entries,
  wrapUnitAll
} from 'frog-utils';
import { compact } from 'lodash';

const meta = {
  name: 'Ranking compare CS211',
  shortDesc: 'Make change matrix based upon rankings',
  description: 'Make change matrix based upon changed rankings'
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
  entries(first).reduce((acc: {}, [k, v]) => {
    if (!second[k]) {
      return { ...acc };
    }
    const options = Object.keys(v);
    const firsttop = entries(v).find(([_, rank]) => rank === 1);
    const secondtop = entries(second[k]).find(([_, rank]) => rank === 1);
    if (!firsttop || !secondtop) {
      return { ...acc };
    }

    options.forEach(f => {
      if (!acc[f]) {
        acc[f] = {};
      }
      options.forEach(s => {
        if (!acc[f][s]) {
          acc[f][s] = 0;
        }
      });
    });

    if (!acc[firsttop[0]]) {
      acc[firsttop[0]] = {};
    }

    if (!acc[firsttop[0]][secondtop[0]]) {
      acc[firsttop[0]][secondtop[0]] = 1;
    } else {
      acc[firsttop[0]][secondtop[0]] += 1;
    }
    return acc;
  }, {});

const operator = (configData, object) => {
  const individual = object.activityData[configData.individual];
  if (!individual) {
    throw 'No individual activity data';
  }

  const first = aryToObj(
    values(individual.payload).map(x => x && x.data && x.data.answers)
  );

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

  const header = matrix =>
    Object.keys(matrix)
      .map(key => {
        if (key !== 'notCompleted') {
          return `<th>${key}</th>`;
        } else {
          return null;
        }
      })
      .join(' ');

  const body = matrix =>
    entries(matrix)
      .map(([row, column]) => {
        if (row !== 'notCompleted') {
          return `<tr key=${row}>
        <td class="vertical-th">${row}</td>
        ${values(column)
          .map(c => `<td>${c}</td>`)
          .join(' ')}
        </tr>`;
        } else {
          return null;
        }
      })
      .join(' ');

  const htmlResult = `
    <div class="op-cs211-ranking">
      <div>
        <div class="table-container">
          <table>
            <caption> Text1 </caption>
            <thead>
              <tr>
                <th></th>
                ${header(transitionFirstSecond)}
              </tr>
            </thead>
            <tbody>
              ${body(transitionFirstSecond)}
            </tbody>
          </table>
       </div>
       <div class="table-container">
          <table>
             <caption> Text2 </caption>
            <thead>
             <tr>
               <th></th>
              ${header(transitionSecondThird)}
             </tr>
            </thead>
            <tbody>
               ${body(transitionSecondThird)}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p>${secondNonCompletion} group(s) did not complete the second activity.</p>
        <p>${thirdNonCompletion} group(s) did not complete the third activity.</p>
      </div>
    </div>
    `;

  return wrapUnitAll({}, { text: htmlResult });
};

export default ({
  id: 'op-cs211-ranking',
  type: 'product',
  operator,
  config,
  meta
}: productOperatorT);
