import check from '../validateProducts';

const hypothesisOut = {
  id: 'Id',
  title: 'string',
  content: 'string',
  address: { street: 'string', zip: 'string' }
};

const boxInNoZip = {
  id: 'Id',
  title: 'string',
  content: 'string',
  address: { street: 'string' }
};

const boxInNoZipString = {
  id: 'string',
  title: 'string',
  content: 'string',
  address: { street: 'string' }
};

const boxIn = {
  _id: 'Id',
  title: 'string',
  content: 'string',
  address: { street: 'string', _zip: 'string' }
};

const deeplyS = {
  id: { name: { age: { p: 'john' }, address: 'hello' } }
};

const deeplySf = {
  id: { name: { age: { p: 'Id' } } }
};

const deeplySf2 = {
  id: { name: { age: { p: 'john', age: 'number' } } }
};

test('optional not required', () => {
  expect(check(hypothesisOut, boxIn)).toBe(true);
});

test('optional out counts as not there', () => {
  expect(check(boxIn, hypothesisOut)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

test('finds nested missing', () => {
  expect(check(boxInNoZip, hypothesisOut)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

test('type mismatch causes error', () => {
  expect(check(boxInNoZipString, hypothesisOut)).toEqual(
    expect.objectContaining({ error: 'mismatch' })
  );
});

test('deeply nested', () => {
  expect(check(deeplyS, deeplyS)).toBe(true);
});

test('deeply nested error', () => {
  expect(check(deeplyS, deeplySf)).toEqual(
    expect.objectContaining({ error: 'mismatch' })
  );
  expect(check(deeplyS, deeplySf2)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

const ary1 = ['Id'];
const ary2 = ['Id', 'string'];
const ary3 = ['string'];

test('array works', () => {
  expect(check(ary1, ary1)).toBe(true);
});

test('array error, improper', () => {
  expect(check(ary1, ary2)).toEqual(
    expect.objectContaining({ error: 'improperArray' })
  );
  expect(check(ary1, [])).toEqual(
    expect.objectContaining({ error: 'improperArray' })
  );
});

test('array error', () => {
  expect(check(ary1, ary3)).toEqual(
    expect.objectContaining({ error: 'mismatch' })
  );
});

const aryobj = [{ name: 'string' }];
const aryobjerr = [{ name: 'string', id: 'Id' }];

test('array object', () => {
  expect(check(aryobj, aryobj)).toBe(true);
});

test('array object error', () => {
  expect(check(aryobj, aryobjerr)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

const optional = [
  { name: 'string', age: 'number', _meta: { description: 'string' } }
];
const notoptional = [
  { name: 'string', age: 'number', meta: { description: 'string' } }
];

const optionalmatch = [{ name: 'string', age: 'number' }];

const optionalwrongmeta = [
  { name: 'string', age: 'number', meta: { desc: 'string' } }
];

test('optional is OK', () => {
  expect(check(optionalmatch, optional)).toBe(true);
});

test('not optional is not OK', () => {
  expect(check(optionalmatch, notoptional)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

test('if exists, should be correct, error', () => {
  expect(check(optionalwrongmeta, optional)).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

test('if exists, should be correct, correct', () => {
  expect(check(optional, optional)).toBe(true);
});

const a = { _: { name: 'string', age: 'number' } };
const c = { name: 'number', age: 'number', meta: { description: 'string' } };

test('entire conditional, ok', () => {
  expect(check(undefined, a)).toBe(true);
});

test('entire conditional, error', () => {
  expect(check(c, a)).toEqual(expect.objectContaining({ error: 'mismatch' }));
});

test('target undefined', () => {
  expect(check({ id: 'number' }, undefined)).toBe(true);
});
test('entirely optional source', () => {
  expect(check({ _: { age: 'number' } }, { age: 'number' })).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
});

test('any', () => {
  expect(check([{ age: 'number' }], ['any'])).toBe(true);
  expect(check([{ age: 'number' }], { ideas: ['any'] })).toEqual(
    expect.objectContaining({ error: 'mismatch' })
  );
  expect(check(['any'], [{ age: 'number' }])).toEqual(
    expect.objectContaining({ error: 'undefined' })
  );
  expect(check({ ideas: [{ age: 'number' }] }, { ideas: ['any'] })).toBe(true);
});
