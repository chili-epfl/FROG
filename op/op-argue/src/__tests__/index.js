import lodash from 'lodash';

import pkg from '../index';

const operator = pkg.operator;

lodash.shuffle = jest.fn(x => [...x].sort());

const obj1 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4']
  },
  activityData: {
    payload: {
      1: {
        data: {
          quizz1: ['A', 'B', 'C'],
          quizz2: {
            q1: '2',
            alpha: {
              a: 'A',
              b: 'B'
            }
          }
        }
      },
      2: {
        data: {
          quizz1: ['A', 'B'],
          quizz2: {
            q1: '3',
            alpha: {
              a: 'C',
              b: 'B'
            }
          }
        }
      },
      3: {
        data: {
          quizz1: ['A', 'B', 'C'],
          quizz2: {
            q1: '2',
            alpha: {
              a: 'A',
              b: 'D'
            }
          }
        }
      },
      4: {
        data: {
          quizz1: ['C', 'E'],
          quizz2: {
            q1: '8'
          }
        }
      }
    }
  }
};

const obj2 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5']
  },
  activityData: {
    payload: {
      1: {
        data: {
          quizz1: ['A', 'B', 'C'],
          quizz2: {
            q1: '2',
            alpha: {
              a: 'A',
              b: 'B'
            }
          }
        }
      },
      2: {
        data: {
          quizz1: ['A', 'B'],
          quizz2: {
            q1: '3',
            alpha: {
              a: 'C',
              b: 'B'
            }
          }
        }
      },
      3: {
        data: {
          quizz1: ['A', 'B', 'C'],
          quizz2: {
            q1: '2',
            alpha: {
              a: 'A',
              b: 'D'
            }
          }
        }
      },
      4: {
        data: {
          quizz1: ['C', 'E'],
          quizz2: {
            q1: '8'
          }
        }
      },
      5: {
        data: {
          quizz1: ['C', 'E'],
          quizz2: {
            q1: '8'
          }
        }
      }
    }
  }
};

const obj3 = {
  globalStructure: {
    studentIds: ['1', '2', '3', '4', '5', '6']
  },
  activityData: {
    payload: {
      1: {
        data: {
          quizz1: ['A', 'A'],
          quizz2: {
            q1: '1'
          }
        }
      },
      2: {
        data: {
          quizz1: ['C', 'C'],
          quizz2: {
            q1: '1'
          }
        }
      },
      3: {
        data: {
          quizz1: ['A', 'B'],
          quizz2: {
            q1: '2'
          }
        }
      },
      4: {
        data: {
          quizz1: ['A', 'C'],
          quizz2: {
            q1: '2'
          }
        }
      },
      5: {
        data: {
          quizz1: ['B', 'C'],
          quizz2: {
            q1: '2'
          }
        }
      },
      6: {
        data: {
          quizz1: ['B', 'B'],
          quizz2: {
            q1: '1'
          }
        }
      }
    }
  }
};

const expected1 = {
  group: { '1': ['1', '4'], '2': ['2', '3'] }
};

const expected2 = {
  group: { '1': ['1', '4'], '2': ['2', '3', '5'] }
};

const expected3 = {
  group: { '1': ['1', '5'], '2': ['2', '3'], '3': ['4', '6'] }
};

test('Test with real obj, random case: 4 students', () =>
  expect(operator({}, obj1)).toEqual(expected1));

test('Test with real obj, odd case: 5 students', () =>
  expect(operator({}, obj2)).toEqual(expected2));

test('Test with real obj,  unique sol: 6 students', () =>
  expect(operator({}, obj3)).toEqual(expected3));

// const genGroupFromTabADCB = (tab, x) => {
//   const { students } = tab;
//   const newStud = [];
//   for (let i = 0; i < students.length; i += 1) {
//     for (let j = 0; j < x; j += 1) {
//       newStud.push(students[i]);
//     }
//   }
//   return { students: newStud };
// };
//
// const verifyAnsFromGen4 = tab => {
//   let success = 1;
//   for (let i = 0; i < tab.length; i += 1) {
//     const elem = tab[i];
//     switch (true) {
//       case elem[0] >= 0 * tab.length / 2 && elem[0] < 1 * tab.length / 2:
//         success *= elem[1] >= 3 * tab.length / 2 && elem[1] < 4 * tab.length / 2
//           ? 1
//           : 0;
//         break;
//       case elem[0] >= 1 * tab.length / 2 && elem[0] < 2 * tab.length / 2:
//         success *= elem[1] >= 2 * tab.length / 2 && elem[1] < 3 * tab.length / 2
//           ? 1
//           : 0;
//         break;
//       default:
//         break;
//     }
//   }
//   return success;
// };

// test('Test 6, with gen and verifier: 4x10 students, 3 answers', () =>
//   expect(
//     verifyAnsFromGen4(operator({}, genGroupFromTabADCB(obj3, 10)))
//   ).toBeTruthy());
