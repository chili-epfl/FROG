// @flow

import { type socialOperatorT } from 'frog-utils';

const meta = {
  name: 'Jigsaw',
  shortDesc: 'Assign students to groups and roles',
  description:
    'Given a list of roles, students are assigned to groups and roles, where each role only appears once in each group.'
};

const config = {
  type: 'object',
  properties: {
    roles: {
      type: 'string',
      title: 'Comma-separated list of roles'
    },
    mix: {
      type: 'boolean',
      title: 'Mix previous groups?'
    }
  }
};

export default ({
  id: 'op-jigsaw',
  type: 'social',
  version: 1,
  meta,
  config,
  outputDefinition: ['group', 'role']
}: socialOperatorT);
