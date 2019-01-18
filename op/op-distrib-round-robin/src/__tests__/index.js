import operator from '../operatorRunner';

const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

const object = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5'] },
  activityData: {
    structure: 'individual',
    payload: {
      aa: {
        data: { aa: { text: 'hi' }, aa1: { text: 'ho' } }
      },
      bb: {
        data: { bb: { text: 'hxxi' } }
      },
      cc: {
        data: { cc: { text: 'hxzzxi' } }
      },
      dd: {
        data: { dd: { text: 'hzzxxi' } }
      }
    }
  }
};

test('Distribute', () => {
  expect(operator({}, object)).toEqual({
    payload: {
      aa: {
        config: {},
        data: [{ bb: { text: 'hxxi' } }, { cc: { text: 'hxzzxi' } }]
      },
      bb: {
        config: {},
        data: [{ cc: { text: 'hxzzxi' } }, { dd: { text: 'hzzxxi' } }]
      },
      cc: {
        config: {},
        data: [
          { dd: { text: 'hzzxxi' } },
          { aa: { text: 'hi' }, aa1: { text: 'ho' } }
        ]
      },
      dd: {
        config: {},
        data: [
          { aa: { text: 'hi' }, aa1: { text: 'ho' } },
          { bb: { text: 'hxxi' } }
        ]
      }
    },
    structure: 'individual'
  });
});

test('Distribute 2', () => {
  expect(operator({ count: 2 }, object)).toEqual({
    payload: {
      aa: {
        config: {},
        data: [{ bb: { text: 'hxxi' } }, { cc: { text: 'hxzzxi' } }]
      },
      bb: {
        config: {},
        data: [{ cc: { text: 'hxzzxi' } }, { dd: { text: 'hzzxxi' } }]
      },
      cc: {
        config: {},
        data: [
          { dd: { text: 'hzzxxi' } },
          { aa: { text: 'hi' }, aa1: { text: 'ho' } }
        ]
      },
      dd: {
        config: {},
        data: [
          { aa: { text: 'hi' }, aa1: { text: 'ho' } },
          { bb: { text: 'hxxi' } }
        ]
      }
    },
    structure: 'individual'
  });
});

const all = {
  payload: {
    aa: {
      config: {},
      data: [
        { bb: { text: 'hxxi' } },
        { cc: { text: 'hxzzxi' } },
        { dd: { text: 'hzzxxi' } }
      ]
    },
    bb: {
      config: {},
      data: [
        { cc: { text: 'hxzzxi' } },
        { dd: { text: 'hzzxxi' } },
        { aa: { text: 'hi' }, aa1: { text: 'ho' } }
      ]
    },
    cc: {
      config: {},
      data: [
        { dd: { text: 'hzzxxi' } },
        { aa: { text: 'hi' }, aa1: { text: 'ho' } },
        { bb: { text: 'hxxi' } }
      ]
    },
    dd: {
      config: {},
      data: [
        { aa: { text: 'hi' }, aa1: { text: 'ho' } },
        { bb: { text: 'hxxi' } },
        { cc: { text: 'hxzzxi' } }
      ]
    }
  },
  structure: 'individual'
};

test('Distribute 3', () => {
  expect(operator({ count: 2 }, object)).toEqual(all);
});

test('Distribute 4', () => {
  expect(operator({ count: 2 }, object)).toEqual(all);
});

test('Distribute 88', () => {
  expect(operator({ count: 2 }, object)).toEqual(all);
});

const groupObj = {
  globalStructure: { studentIds: ['1', '2', '3', '4', '5', '6', '7', '8'] },
  socialStructure: {
    group: { g1: ['1', '2'], g2: ['3', '4'], g3: ['5', '6'], g4: ['7', '8'] }
  },
  activityData: {
    structure: { groupingKey: 'group' },
    payload: {
      g1: {
        data: { aa: { text: 'hi' }, aa1: { text: 'ho' } }
      },
      g2: {
        data: { bb: { text: 'hxxi' } }
      },
      g3: {
        data: { cc: { text: 'hxzzxi' } }
      },
      g4: {
        data: { dd: { text: 'hzzxxi' } }
      }
    }
  }
};

test('Distribute 1 group', () => {
  expect(operator({}, groupObj)).toEqual({
    payload: {
      g1: { config: {}, data: [{ bb: { text: 'hxxi' } }] },
      g2: { config: {}, data: [{ cc: { text: 'hxzzxi' } }] },
      g3: { config: {}, data: [{ dd: { text: 'hzzxxi' } }] },
      g4: { config: {}, data: [{ aa: { text: 'hi' }, aa1: { text: 'ho' } }] }
    },
    structure: { groupingKey: 'group' }
  });
});

test('Distribute 2 group', () => {
  expect(operator({ count: 2 }, groupObj)).toEqual({
    payload: {
      g1: {
        config: {},
        data: [{ bb: { text: 'hxxi' } }, { cc: { text: 'hxzzxi' } }]
      },
      g2: {
        config: {},
        data: [{ cc: { text: 'hxzzxi' } }, { dd: { text: 'hzzxxi' } }]
      },
      g3: {
        config: {},
        data: [
          { dd: { text: 'hzzxxi' } },
          { aa: { text: 'hi' }, aa1: { text: 'ho' } }
        ]
      },
      g4: {
        config: {},
        data: [
          { aa: { text: 'hi' }, aa1: { text: 'ho' } },
          { bb: { text: 'hxxi' } }
        ]
      }
    },
    structure: { groupingKey: 'group' }
  });
});

test('Distribute 88 group', () => {
  expect(operator({ count: 88 }, groupObj)).toEqual({
    payload: {
      g1: {
        config: {},
        data: [
          { bb: { text: 'hxxi' } },
          { cc: { text: 'hxzzxi' } },
          { dd: { text: 'hzzxxi' } }
        ]
      },
      g2: {
        config: {},
        data: [
          { cc: { text: 'hxzzxi' } },
          { dd: { text: 'hzzxxi' } },
          { aa: { text: 'hi' }, aa1: { text: 'ho' } }
        ]
      },
      g3: {
        config: {},
        data: [
          { dd: { text: 'hzzxxi' } },
          { aa: { text: 'hi' }, aa1: { text: 'ho' } },
          { bb: { text: 'hxxi' } }
        ]
      },
      g4: {
        config: {},
        data: [
          { aa: { text: 'hi' }, aa1: { text: 'ho' } },
          { bb: { text: 'hxxi' } },
          { cc: { text: 'hxzzxi' } }
        ]
      }
    },
    structure: { groupingKey: 'group' }
  });
});
