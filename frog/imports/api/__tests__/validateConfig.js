import v from '../validateConfig';

const valid = (id, obj, config, validfn) =>
  v('activity', id, obj, config, validfn);

const config = {
  type: 'object',
  properties: {
    groupsize: {
      type: 'number',
      title: 'Desired group size'
    },
    strategy: {
      type: 'string',
      title:
        'Group formation strategy, optimize for at least this number of students in each group (minimum) or no more than this number of students per group (maximum)?',
      enum: ['minimum', 'maximum']
    },
    grouping: {
      type: 'string',
      title: "Name of social attribute (default 'group')"
    }
  }
};
const obj = { groupsize: 3, strategy: 'minimum', grouping: 'group' };

test('test correct validator', () => {
  expect(valid('1', obj, config)).toEqual([]);
});
const obj1 = { groupsize: '3', strategy: 'minimum', grouping: 'group' };

test('test correct validator, number/string', () => {
  expect(valid('1', obj1, config)).toEqual([
    {
      err: "Field 'Desired group size' is not of a type(s) number",
      field: 'groupsize',
      nodeType: 'activity',
      id: '1',
      severity: 'error',
      type: 'invalidConfigField'
    }
  ]);
});

test('test obligatory field', () => {
  expect(valid('1', obj1, config)).toEqual([
    {
      err: "Field 'Desired group size' is not of a type(s) number",
      field: 'groupsize',
      nodeType: 'activity',
      id: '1',
      severity: 'error',
      type: 'invalidConfigField'
    }
  ]);
});

const config1 = {
  type: 'object',
  required: ['strategy'],
  properties: {
    groupsize: {
      type: 'number',
      title: 'Desired group size'
    },
    strategy: {
      type: 'string',
      title: 'Group formation strategy',
      enum: ['minimum', 'maximum']
    },
    grouping: {
      type: 'string',
      title: "Name of social attribute (default 'group')"
    }
  }
};

test('test obligatory field', () => {
  expect(valid('1', {}, config1)).toEqual([
    {
      err: "Field 'Group formation strategy' required",
      field: 'strategy',
      nodeType: 'activity',
      id: '1',
      severity: 'error',
      type: 'missingRequiredConfigField'
    }
  ]);
});

const validfns = [
  data =>
    data.strategy.length > 2
      ? {
          field: 'strategy',
          msg: 'Strategy field cannot be longer than 2 characters'
        }
      : null
];

test('test datafns', () => {
  expect(valid('1', obj, config1, validfns)).toEqual([
    {
      field: 'strategy',
      id: '1',
      msg: 'Strategy field cannot be longer than 2 characters',
      nodeType: 'activity',
      severity: 'error',
      type: 'configValidateFn'
    }
  ]);
});

test('test empty requirement', () => {
  expect(valid('1', {}, { type: 'object', properties: {} })).toEqual([]);
});
