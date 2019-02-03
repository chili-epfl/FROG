import lodash from 'lodash';

import ShareDB from 'sharedb';
import operator from '../operatorRunner';
import { generateReactiveFn } from '../../../../frog/imports/api/generateReactiveFn.js';

lodash.shuffle = jest.fn(x => [...x].sort());
jest.spyOn(Date, 'now').mockImplementation(() => 1479427200000);

export const backend = new ShareDB({
  disableDocAction: true,
  disableSpaceDelimitedActions: true
});
export const connection = backend.connect();
const doc = connection.get('random');
const dataFn = generateReactiveFn(doc);

const object = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5'] },
  activityData: {
    structure: 'individual',
    payload: {
      '7qB54hrr4rkWirpvN': {
        data: { text: 'hi' }
      },
      BomTyjTqYpoxhnkSs: {
        data: { text: 'ho' }
      },
      B54hrr4rkWirpvN: {
        data: { text: 'hi1' }
      },
      mTyjTqYpoxhnkSs: {
        data: { text: 'ho1' }
      }
    }
  }
};
describe('tests', () => {
  const constantDate = new Date('2018-01-01T12:00:00');

  beforeAll(() => {
    global.Date = class extends Date {
      constructor() {
        super();
        return constantDate;
      }
    };
  });

  test('Distribute', () => {
    expect(operator({}, object, dataFn)).toEqual({
      payload: {
        '7qB54hrr4rkWirpvN': {
          data: {
            cjn1: {
              from: '7qB54hrr4rkWirpvN',
              id: 'cjn1',
              li: {
                id: 'cjn3',
                liDocument: {
                  createdAt: new Date('2018-01-01T11:00:00.000Z'),
                  liType: 'li-peerReview',
                  payload: {
                    from: '7qB54hrr4rkWirpvN',
                    prompt: undefined,
                    reviewComponentLIType: 'li-richText',
                    reviewId: 'cjn2',
                    reviewItem: { text: 'hi' }
                  }
                }
              }
            }
          }
        },
        B54hrr4rkWirpvN: {
          data: {
            cjn7: {
              from: 'B54hrr4rkWirpvN',
              id: 'cjn7',
              li: {
                id: 'cjn9',
                liDocument: {
                  createdAt: new Date('2018-01-01T11:00:00.000Z'),
                  liType: 'li-peerReview',
                  payload: {
                    from: 'B54hrr4rkWirpvN',
                    prompt: undefined,
                    reviewComponentLIType: 'li-richText',
                    reviewId: 'cjn8',
                    reviewItem: { text: 'hi1' }
                  }
                }
              }
            }
          }
        },
        BomTyjTqYpoxhnkSs: {
          data: {
            cjn4: {
              from: 'BomTyjTqYpoxhnkSs',
              id: 'cjn4',
              li: {
                id: 'cjn6',
                liDocument: {
                  createdAt: new Date('2018-01-01T11:00:00.000Z'),
                  liType: 'li-peerReview',
                  payload: {
                    from: 'BomTyjTqYpoxhnkSs',
                    prompt: undefined,
                    reviewComponentLIType: 'li-richText',
                    reviewId: 'cjn5',
                    reviewItem: { text: 'ho' }
                  }
                }
              }
            }
          }
        },
        mTyjTqYpoxhnkSs: {
          data: {
            cjn10: {
              from: 'mTyjTqYpoxhnkSs',
              id: 'cjn10',
              li: {
                id: 'cjn12',
                liDocument: {
                  createdAt: new Date('2018-01-01T11:00:00.000Z'),
                  liType: 'li-peerReview',
                  payload: {
                    from: 'mTyjTqYpoxhnkSs',
                    prompt: undefined,
                    reviewComponentLIType: 'li-richText',
                    reviewId: 'cjn11',
                    reviewItem: { text: 'ho1' }
                  }
                }
              }
            }
          }
        }
      },
      structure: 'individual'
    });
  });
});
