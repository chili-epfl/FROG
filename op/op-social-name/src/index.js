// @flow
import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Assign group by name',
  shortName: 'Manually group',
  shortDesc: 'Maps students to groups by name',
  description:
    'Input a list of student names, and group names, and it matches the students to the groups'
};

const config = {
  type: 'object',
  required: ['groupingKeys', 'defaultGroupingValues', 'studentmapping'],
  properties: {
    groupingKeys: {
      type: 'string',
      title: 'Grouping key or keys, separated by comma'
    },
    defaultGroupingValues: {
      type: 'string',
      title: 'Default grouping values for students not listed below'
    },
    studentmapping: {
      type: 'string',
      title:
        'On each line student name, comma, grouping value, in the same order as the group names above'
    }
  }
};

const configUI = {
  studentmapping: {
    'ui:widget': 'textarea',
    'ui:emptyValue': '',
    'ui:options': {
      rows: 15
    }
  }
};

const validateConfig = [
  formData => {
    // taken care of by the obligatory fields
    if (!formData.studentmapping || !formData.groupingKeys) {
      return null;
    }
    const list = formData.studentmapping
      .split('\n')
      .filter(x => x.trim() !== '');
    const n = formData.groupingKeys.split(',').length;
    const failing = list.find(x => x.split(',').length !== n + 1);
    if (failing) {
      return {
        err: `Line ${failing} does not have right number of attributes`
      };
    }
    const empty = list.find(
      x => x.split(',').findIndex(y => y.trim() === '') !== -1
    );
    if (empty) {
      return {
        err: `Line ${empty} has empty attributes`
      };
    }
    return null;
  }
];

const outputDefinition = configData =>
  configData.groupingKeys.split(',').map(f => f.trim());

export default ({
  id: 'op-social-name',
  type: 'social',
  configVersion: 1,
  config,
  configUI,
  validateConfig,
  outputDefinition,
  meta
}: socialOperatorT);
