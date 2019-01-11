import op from '../operatorRunner';
import { obj2, obj3, spread1, spread2 } from '../__fixtures__';

const object = {
  _id: 'cjgccn7m5000ik7j4g5i6uc2i',
  activityData: {
    structure: 'group',
    payload: {
      '1': { data: spread1 },
      '2': { data: spread2 }
    }
  }
};

test('Can merge two', () => {
  expect(op({}, object)).toEqual({});
});

test('Real-world test', () => {
  expect(op({}, obj2)).toEqual({});
});

test.only('Real-world test sheet', () => {
  expect(op({}, obj3)).toMatchSnapshot();
});
