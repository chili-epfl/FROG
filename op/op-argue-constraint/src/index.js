// @flow

import { chunk } from 'lodash';
import {
  type socialOperatorT,
  type socialStructureT,
  focusStudent
} from 'frog-utils';

const meta = {
  name: 'Argue (with constraints)',
  shortDesc: 'Group students to argue',
  description: 'Group students with as few similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {
    grouping: {
      type: 'socialAttribute',
      title: 'Grouping attribute'
    },
    matching: {
      type: 'string',
      title: 'What group pairs are ok? example "1,1;2,3;3,2;4,4"'
    }
  }
};

// Function that computes our optimization goal given a list of distances
const M = values => values.reduce((acc, x) => acc + Math.sqrt(x), 0);

const operator = (configData, object): socialStructureT => {
  const { activityData, socialStructure, globalStructure } = object;
  const studentStruct = focusStudent(socialStructure);
  const grouping = (configData && configData.grouping) || 'group';
  // Function to check if pairs of students are valid given the
  // configured constraints
  const matching = configData && configData.matching;
  const validMatchings = matching && matching.split(';');
  const V = (studentA, studentB) => {
    if (!validMatchings) {
      return true;
    }
    const groupA = studentStruct[studentA] && studentStruct[studentA][grouping];
    const groupB = studentStruct[studentB] && studentStruct[studentB][grouping];
    const str = [groupA, groupB].join(',');
    return validMatchings.includes(str);
  };

  // Function to create an initial pairing which will be
  // iteratively improved
  const { studentIds } = globalStructure;
  const matchedStudents = {};
  const makeInitialGrouping = () => {
    const pairs = [];
    studentIds.forEach(A =>
      studentIds.forEach(B => {
        if (A !== B && !matchedStudents[A] && !matchedStudents[B]) {
          if (V(A, B)) {
            matchedStudents[A] = true;
            matchedStudents[B] = true;
            pairs.push([A, B]);
          }
        }
      })
    );
    return pairs;
  };
  const pairs = makeInitialGrouping();
  // Function to return the distance between two students
  const { payload } = activityData;
  const data = (payload.all && payload.all.data) || {};
  const matrix = data.distanceMatrix;
  const studentIndex = {};
  studentIds.forEach((stu, idx) => {
    studentIndex[stu] = idx;
  });
  const D = (studentA, studentB) => {
    const idxA = studentIndex[studentA];
    const idxB = studentIndex[studentB];
    return (matrix && matrix[idxA] && matrix[idxA][idxB]) || 0;
  };

  // Iteratively improves the matching `pairs`
  let modified = true;
  let iter = 0;
  const iteration = () => {
    iter += 1;
    modified = false;
    pairs.forEach((p0, i0) => {
      pairs.forEach((p1, i1) => {
        if (!modified && i0 < i1) {
          const [A, B, a, b] = [...p0, ...p1];
          const score = M([D(A, B), D(a, b)]);
          if (V(A, a) && V(B, b) && M([D(A, a), D(B, b)]) > score) {
            pairs[i0] = [A, a];
            pairs[i1] = [B, b];
            modified = true;
          } else if (V(A, b) && V(B, a) && M([D(A, b), D(B, a)]) > score) {
            pairs[i0] = [A, b];
            pairs[i1] = [B, a];
            modified = true;
          }
        }
      });
    });
  };
  while (modified && iter < 10000) {
    iteration();
  }

  const groups = {};
  pairs.forEach((pair, idx) => {
    groups['' + (1 + idx)] = pair;
  });

  const unmatchedStudents = studentIds.filter(id => !matchedStudents[id]);
  chunk(unmatchedStudents, 2).forEach((pair, idx) => {
    if (pair.length > 1) {
      groups['unmatched' + (idx + 1)] = pair;
    } else if (groups['unmatched1']) {
      groups['unmatched1'].push(pair[0]);
    } else if (groups['1']) {
      groups['1'].push(pair[0]);
    } else {
      groups['alone'] = pair;
    }
  });

  return { group: groups };
};

export default ({
  id: 'op-argue-constraint',
  type: 'social',
  operator,
  config,
  meta,
  outputDefinition: ['group']
}: socialOperatorT);
