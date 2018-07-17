// @flow

import type { controlOperatorT } from 'frog-utils';

const meta = {
  name: 'Select activity based on past performance',
  shortName: 'Performance split',
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
      type: 'targetActivity',
      title: 'Activity for low-performance students'
    },
    activity_high: {
      type: 'targetActivity',
      title: 'Activity for high-performance students'
    }
  }
};

const configUI = {
  min_percentage: { conditional: 'use_percentage' },
  min_correct: { conditional: formData => !formData.use_percentage }
};

export default ({
  id: 'op-performance-select',
  type: 'control',
  configVersion: 1,
  config,
  configUI,
  meta
}: controlOperatorT);
