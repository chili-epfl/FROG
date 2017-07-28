import check, { Activity, Operator, tryRunChain } from '../validateProducts';

const opdistribute = new Operator('distribute', {
  input: ['any'],
  output: ['any']
});
const objToAry = new Operator('objtoary', {
  input: { Id: 'any-1' },
  output: ['any-1']
});

const a1 = new Activity('1', [
  { id: 'Id', title: 'string', content: 'string' }
]);
const a2 = new Activity('2', [
  { _id: 'Id', title: 'string', content: 'string' }
]);
const a0 = new Activity('3', {
  Id: { id: 'Id', title: 'string', content: 'string' }
});
const a4 = new Activity('4', {
  Id: { id: 'string', title: 'string', content: 'string' }
});

const chain1 = [a1, a2];
const chain2 = [a1, a4];
const chain3 = [a1, opdistribute, a2];
const chain4 = [a1, objToAry, opdistribute, a2];
const chain6 = [a0, objToAry, opdistribute, a0];
const chain5 = [a4, objToAry, a2];

test('simple chain', () => {
  expect(tryRunChain(chain1)).toBe(true);
});
test('simple chain, broken', () => {
  expect(tryRunChain(chain4)).toEqual(
    expect.objectContaining({
      brokenNode: expect.objectContaining({ name: '2' }),
      error: expect.objectContaining({ error: 'undefined' })
    })
  );
});
test('chain with operator, should work', () => {
  expect(tryRunChain(chain3)).toBe(true);
});
test('chain with operator, should not work', () => {
  expect(tryRunChain(chain4)).toEqual(
    expect.objectContaining({
      brokenNode: expect.objectContaining({ name: '2' }),
      error: expect.objectContaining({ error: 'undefined' })
    })
  );
});
test('chain with operator and transform, should work', () => {
  expect(tryRunChain(chain5)).toBe(true);
});
test('chain with operator and transform, should not work', () => {
  expect(tryRunChain(chain6)).toEqual(
    expect.objectContaining({
      brokenNode: expect.objectContaining({ name: '3' }),
      error: expect.objectContaining({ error: 'undefined' })
    })
  );
});
