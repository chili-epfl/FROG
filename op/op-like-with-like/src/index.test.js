import { operator } from '.';

const configData = {};
test('does not work without studentId in product', () => {
  expect(operator(configData, { products: [['a', 'a', 'b', 'c']] })).toEqual({
    product: [],
    socialStructure: {
      undefined: {
        group: '0'
      }
    }
  });
});

test('product with user id', () => {
  expect(
    operator(configData, {
      products: [
        [
          { userId: 'a', data: 'b' },
          { userId: 'b', data: 'b' },
          { userId: 'c', data: 'c' }
        ]
      ]
    })
  ).toEqual({
    product: [],
    socialStructure: { a: { group: '0' }, b: { group: '0' }, c: { group: '1' } }
  });
});
