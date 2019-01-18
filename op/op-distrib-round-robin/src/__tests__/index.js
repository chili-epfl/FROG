import lodash from 'lodash';

import operator from '../operatorRunner';
import { generateReactiveFn } from '../../../../frog/imports/api/generateReactiveFn.js';

lodash.shuffle = jest.fn(x => [...x].sort());
const dataFn = generateReactiveFn();

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

test('Distribute', () => {
  expect(operator({}, object, dataFn)).toEqual({
    payload: {
      '7qB54hrr4rkWirpvN': {
        data: {
          cjn1: {
            from: '7qB54hrr4rkWirpvN',
            id: 'cjn1',
            li: {
              id: 'cjn2',
              liDocument: {
                createdAt: '2019-01-15T16:05:31.269Z',
                liType: 'li-peerReview',
                payload: {
                  from: '7qB54hrr4rkWirpvN',
                  reviewComponentLIType: 'li-textArea',
                  reviewId: undefined,
                  reviewItem: { text: 'hi' }
                }
              }
            }
          }
        }
      },
      B54hrr4rkWirpvN: {
        data: {
          cjn5: {
            from: 'B54hrr4rkWirpvN',
            id: 'cjn5',
            li: {
              id: 'cjn6',
              liDocument: {
                createdAt: '2019-01-15T16:05:31.269Z',
                liType: 'li-peerReview',
                payload: {
                  from: 'B54hrr4rkWirpvN',
                  reviewComponentLIType: 'li-textArea',
                  reviewId: undefined,
                  reviewItem: { text: 'hi1' }
                }
              }
            }
          }
        }
      },
      BomTyjTqYpoxhnkSs: {
        data: {
          cjn3: {
            from: 'BomTyjTqYpoxhnkSs',
            id: 'cjn3',
            li: {
              id: 'cjn4',
              liDocument: {
                createdAt: '2019-01-15T16:05:31.269Z',
                liType: 'li-peerReview',
                payload: {
                  from: 'BomTyjTqYpoxhnkSs',
                  reviewComponentLIType: 'li-textArea',
                  reviewId: undefined,
                  reviewItem: { text: 'ho' }
                }
              }
            }
          }
        }
      },
      mTyjTqYpoxhnkSs: {
        data: {
          cjn7: {
            from: 'mTyjTqYpoxhnkSs',
            id: 'cjn7',
            li: {
              id: 'cjn8',
              liDocument: {
                createdAt: '2019-01-15T16:05:31.269Z',
                liType: 'li-peerReview',
                payload: {
                  from: 'mTyjTqYpoxhnkSs',
                  reviewComponentLIType: 'li-textArea',
                  reviewId: undefined,
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
