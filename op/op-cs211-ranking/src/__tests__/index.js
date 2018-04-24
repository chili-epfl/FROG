import { object } from './object';
import pkg from '../index';

const config = {
  individual: 'cjgdgp46h001kblj4cwsqtmrk',
  group: 'cjgdgp46i001mblj4u5lfdd4r',
  groupData: 'cjgdgp46h001lblj4whyzno4p'
};

test('works', () => {
  expect(pkg.operator(config, object)).toEqual({});
});
