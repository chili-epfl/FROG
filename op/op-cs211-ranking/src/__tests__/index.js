import { object } from '../__fixtures__/object';
import { object2 } from '../__fixtures__/object2';
import { config3, object3 } from '../__fixtures__/object3';
import operator from '../operatorRunner';

const config = {
  individual: 'cjgdgp46h001kblj4cwsqtmrk',
  group: 'cjgdgp46i001mblj4u5lfdd4r',
  groupData: 'cjgdgp46h001lblj4whyzno4p'
};

test('works', () => {
  expect(operator(config, object)).toMatchSnapshot();
});

const config2 = {
  individual: 'cjgdu4sti00021sj4sy5xdedy',
  group: 'cjgdu4sti00041sj4v5qch1gk',
  groupData: 'cjgdu4sti00031sj47sjionh9'
};

test('works twice', () => {
  expect(operator(config2, object2)).toMatchSnapshot();
});

test.only('works twice', () => {
  expect(operator(config3, object3)).toEqual();
});
