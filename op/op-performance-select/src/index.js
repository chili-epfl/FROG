// @flow

import { shuffle, chunk } from 'lodash';
import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Select activity based on past performance',
  shortDesc:
    'Split students into two groups based on quiz scores, and assign activities',
  description: ''
};

const config = {
  type: 'object',
  required: ['activity_low', 'activity_high', 'min_correct', 'min_percentage'],
  properties: {
    use_percentage: { type: 'boolean', title: 'Use percentage instead' },
    min_correct: {
      type: 'number',
      title: 'Minimum number of correct answers for high-performers'
    },
    min_percentage: {
      type: 'number',
      title: 'Minimum percentage of answers for high-performers'
    },
    activity_low: {
      type: 'activity',
      title: 'Activity for low-performance students'
    },
    activity_high: {
      type: 'activity',
      title: 'Activity for high-performance students'
    }
  }
};

const configUI = {
  min_percentage: { conditional: 'use_percentage' },
  min_correct: { conditional: formData => !formData.use_percentage }
};

const operator = (configData, object) => {
  const isHighPerformer = configData.use_percentage
    ? (actual, max) => actual / max >= configData.min_percentage
    : (actual, _) => actual >= configData.min_correct;

  const data = object.activityData;
  const high = [];
  const low = [];
  if (data.structure === 'individual') {
    Object.keys(data.payload).forEach(student => {
      if (
        isHighPerformer(
          data.payload[student].data.correctCount,
          data.payload[student].data.maxCorrect
        )
      ) {
        high.push(student);
      } else {
        low.push(student);
      }
    });
  }
  return {
    list: {
      [configData.activity_low]: {
        structure: 'individual',
        mode: 'include',
        payload: low.reduce((acc, stud) => ({ ...acc, [stud]: true }), {})
      },
      [configData.activity_high]: {
        structure: 'individual',
        mode: 'include',
        payload: high.reduce((acc, stud) => ({ ...acc, [stud]: true }), {})
      }
    }
  };
};

export default ({
  id: 'op-performance-select',
  type: 'control',
  operator,
  config,
  configUI,
  meta
}: controlOperatorT);
