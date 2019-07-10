// @flow

import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Jigsaw',
  shortDesc: 'Assign students to groups and roles',
  description:
    'Given a list of roles, students are assigned to groups and roles, where each role only appears once in each group.',
  category: 'Complex'
};

const config = {
  type: 'object',
  required: ['roles'],
  properties: {
    roles: {
      type: 'string',
      title: 'Comma-separated list of roles'
    },
    mix: {
      type: 'boolean',
      title: 'Mix previous groups (groups stay the same, roles rotate)?'
    }
  }
};

const configUI = { roles: { conditional: formData => !formData.mix } };

export default ({
  id: 'op-jigsaw',
  type: 'social',
  configVersion: 1,
  meta,
  config,
  configUI,
  outputDefinition: ['group', 'role']
}: socialOperatorT);
