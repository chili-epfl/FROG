// @flow

import { type ActivityPackageT } from 'frog-utils';
import dashboard from './dashboard';

const meta = {
  name: 'Simple chat',
  shortDesc: 'New activity, no description available',
  description: 'New activity, no description available'
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Title',
      type: 'string'
    },
    allowLearningItem: {
      title: 'Allow adding Learning Items',
      type: 'boolean',
      default: true
    },
    showMood: {
      title: 'Show collaboratively editable mood',
      type: 'boolean',
      default: true
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { mood: '', config: {}, chats: [] };

export default ({
  id: 'ac-simple-chat',
  type: 'react-component',
  configVersion: 1,
  meta,
  config,
  dashboard,
  dataStructure
}: ActivityPackageT);
