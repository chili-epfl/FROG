import lodash from 'lodash';

import operator from '../operatorRunner';

lodash.shuffle = jest.fn(x => [...x].sort());

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
  expect(operator({}, object)).toEqual({
    payload: {
      '7qB54hrr4rkWirpvN': {
        id: {
          id: 'cjm63y0yn0000muj5aha4buoh',
          liDocument: {
            createdAt: '2018-09-17T09:49:12.671Z',
            createdBy: 'op-distrib-peer-review',
            liType: 'li-peerReview',
            payload: {
              reviewComponentLIType: 'li-textarea',
              reviewId: undefined,
              reviewItem: { data: { text: 'hi1' } }
            }
          }
        }
      },
      B54hrr4rkWirpvN: {
        id: {
          id: 'cjm63y0yn0001muj52fsf0c2h',
          liDocument: {
            createdAt: '2018-09-17T09:49:12.671Z',
            createdBy: 'op-distrib-peer-review',
            liType: 'li-peerReview',
            payload: {
              reviewComponentLIType: 'li-textarea',
              reviewId: undefined,
              reviewItem: { data: { text: 'ho' } }
            }
          }
        }
      },
      BomTyjTqYpoxhnkSs: {
        id: {
          id: 'cjm63y0yn0002muj5wtwazh5s',
          liDocument: {
            createdAt: '2018-09-17T09:49:12.671Z',
            createdBy: 'op-distrib-peer-review',
            liType: 'li-peerReview',
            payload: {
              reviewComponentLIType: 'li-textarea',
              reviewId: undefined,
              reviewItem: { data: { text: 'ho1' } }
            }
          }
        }
      },
      mTyjTqYpoxhnkSs: {
        id: {
          id: 'cjm63y0yn0003muj5i5fgb8p1',
          liDocument: {
            createdAt: '2018-09-17T09:49:12.671Z',
            createdBy: 'op-distrib-peer-review',
            liType: 'li-peerReview',
            payload: {
              reviewComponentLIType: 'li-textarea',
              reviewId: undefined,
              reviewItem: { data: { text: 'hi' } }
            }
          }
        }
      }
    },
    structure: 'individual'
  });
});
