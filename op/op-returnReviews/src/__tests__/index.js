import pkg from '../operatorRunner';
const object = {
  activityData: {
    structure: 'individual',
    payload: {
      txCqzgxzScdcDkDHW: {
        data: {
          cjo5g5ld0001af4j4vx2n1zv7: {
            id: 'cjo5g5ld0001af4j4vx2n1zv7',
            li: 'cjo5g5ld0001bf4j4sksy9vew',
            from: '5vqDDYQfFoHgCkBub'
          }
        }
      },
      '5vqDDYQfFoHgCkBub': {
        data: {
          cjo5g5ld0001cf4j4f9c0wp75: {
            id: 'cjo5g5ld0001cf4j4f9c0wp75',
            li: 'cjo5g5ld0001df4j4gv21jjky',
            from: '6dd3wGY9dtJ9KhLrn'
          }
        }
      },
      '6dd3wGY9dtJ9KhLrn': {
        data: {
          cjo5g5ld0001ef4j4emuswv87: {
            id: 'cjo5g5ld0001ef4j4emuswv87',
            li: 'cjo5g5ld0001ff4j4b1cubx48',
            from: '6Y8QEfpEZyup8ir4D'
          }
        }
      },
      '6Y8QEfpEZyup8ir4D': {
        data: {
          cjo5g5ld0001gf4j4imja64o4: {
            id: 'cjo5g5ld0001gf4j4imja64o4',
            li: 'cjo5g5ld0001hf4j4k15rg84p',
            from: 'txCqzgxzScdcDkDHW'
          }
        }
      },
      '6Y8rQEfpEZyup8ir4D': {
        data: {
          cjo5g5ld0001gf4j4imja64o4: {
            id: 'cjo5g5ld40001gf4j4imja64o4',
            li: 'cjo5g5ld40001hf4j4k15rg84p',
            from: 'txCqzgxzScdcDkDHW'
          }
        }
      }
    }
  },
  socialStructure: {},
  globalStructure: {
    studentIds: [
      '6Y8QEfpEZyup8ir4D',
      '6dd3wGY9dtJ9KhLrn',
      '5vqDDYQfFoHgCkBub',
      'txCqzgxzScdcDkDHW'
    ],
    students: {
      '6Y8QEfpEZyup8ir4D': 'Peter',
      '6dd3wGY9dtJ9KhLrn': 'Anna',
      '5vqDDYQfFoHgCkBub': 'Aliya',
      txCqzgxzScdcDkDHW: 'Chen Li'
    }
  }
};

test('Basic routing', () => {
  expect(pkg({}, object)).toEqual({
    payload: {
      '5vqDDYQfFoHgCkBub': {
        data: {
          cjn1: {
            from: '5vqDDYQfFoHgCkBub',
            id: 'cjo5g5ld0001af4j4vx2n1zv7',
            li: 'cjo5g5ld0001bf4j4sksy9vew'
          }
        }
      },
      '6Y8QEfpEZyup8ir4D': {
        data: {
          cjn3: {
            from: '6Y8QEfpEZyup8ir4D',
            id: 'cjo5g5ld0001ef4j4emuswv87',
            li: 'cjo5g5ld0001ff4j4b1cubx48'
          }
        }
      },
      '6dd3wGY9dtJ9KhLrn': {
        data: {
          cjn2: {
            from: '6dd3wGY9dtJ9KhLrn',
            id: 'cjo5g5ld0001cf4j4f9c0wp75',
            li: 'cjo5g5ld0001df4j4gv21jjky'
          }
        }
      },
      txCqzgxzScdcDkDHW: {
        data: {
          cjn4: {
            from: 'txCqzgxzScdcDkDHW',
            id: 'cjo5g5ld0001gf4j4imja64o4',
            li: 'cjo5g5ld0001hf4j4k15rg84p'
          },
          cjn5: {
            from: 'txCqzgxzScdcDkDHW',
            id: 'cjo5g5ld40001gf4j4imja64o4',
            li: 'cjo5g5ld40001hf4j4k15rg84p'
          }
        }
      }
    },
    structure: 'individual'
  });
});
