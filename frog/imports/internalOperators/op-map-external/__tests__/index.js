import operator from '../operatorRunner';
import { activityData } from '../__fixtures__/hypothesis';

const object = {
  globalStructure: {
    students: { '1': 'rsivaraj', '2': 'rockpalm', '3': 'tasha_mrema' }
  },
  activityData
};

test('Hypothesis', () => expect(operator({}, object)).toMatchSnapshot());
