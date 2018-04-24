import { object } from '../__fixtures__/object';
import { object2 } from '../__fixtures__/object2';
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
    payload: { all: { config: { text }, data: {} } },
    structure: 'all'
  });
});

const text2 = `Result:

Not completing second activity: 2
Not completing third activity: 2

Transition matrix first->second activity:
{
  "notCompleted": 2,
  "plane": {"train": 2},
  "train": {"swimming": 1},
  "swimming": {"swimming": 1}
}


Transition matrix second->third activity:
{"notCompleted": 0, "train": {"train": 2}, "swimming": {"swimming": 2}}
`;

const config2 = {
  individual: 'cjgdu4sti00021sj4sy5xdedy',
  group: 'cjgdu4sti00041sj4v5qch1gk',
  groupData: 'cjgdu4sti00031sj47sjionh9'
};

test('works twice', () => {
  expect(pkg.operator(config2, object2)).toEqual({
    payload: { all: { config: { text: text2 }, data: {} } },
    structure: 'all'
  });
});
