import { object } from './object';
import pkg from '../index';

const config = {
  individual: 'cjgdgp46h001kblj4cwsqtmrk',
  group: 'cjgdgp46i001mblj4u5lfdd4r',
  groupData: 'cjgdgp46h001lblj4whyzno4p'
};

const text = `Result:

Not completing second activity: 0
Not completing third activity: 1

Transition matrix first->second activity:
{
  "notCompleted": 2,
  "train": {"train": 1, "jump": 1},
  "drag": {"jump": 1},
  "jump": {"train": 1}
}


Transition matrix second->third activity:
{"notCompleted": 2, "train": {"drag": 2}}
`;

test('works', () => {
  expect(pkg.operator(config, object)).toEqual({
    payload: { all: { config: { text: text }, data: {} } },
    structure: 'all'
  });
});
