import check, { Activity, Operator, tryRunChain } from '../validateProducts';

const opdistribute = new Operator('distribute', {
  input: ['any'],
  output: ['any']
});
const objToAry = new Operator('objtoary', {
  input: { Id: 'any-1' },
  output: ['any-1']
});

const a0 = new Activity('a0', {
  Id: { id: 'Id', title: 'string', content: 'string' }
});
const a1 = new Activity('a1', [
  { id: 'Id', title: 'string', content: 'string' }
]);
const a2 = new Activity('a2', [
  { _id: 'Id', title: 'string', content: 'string' }
]);
const a4 = new Activity('a4', {
  Id: { id: 'string', title: 'string', content: 'string' }
});

const chains = [
  [[a1, objToAry], ['mismatch', 'objtoary']],
  [[a1, a2], [true]],
  [[a1, a4], ['mismatch', 'a4']],
  [[a1, opdistribute, a2], [true]],
  [[a0, objToAry, opdistribute, a2], [true]],
  [[a1, objToAry, opdistribute, a0], ['mismatch', 'objtoary']],
  [[a4, objToAry, a2], [true]]
];

chains.forEach((x, i) => {
  if (x[1][0] === true) {
    test('should work ' + i, () => {
      expect(tryRunChain(x[0])).toBe(true);
    });
  } else {
    test('broken ' + i, () => {
      expect(tryRunChain(x[0])).toEqual(
        expect.objectContaining({
          brokenNode: expect.objectContaining({ name: x[1][1] }),
          error: expect.objectContaining({ error: x[1][0] })
        })
      );
    });
  }
});
