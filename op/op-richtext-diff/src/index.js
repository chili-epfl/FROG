// @flow

import { type productOperatorT } from 'frog-utils';

const meta = {
  name: 'Rich text diff',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: { toDiff: { title: 'Text to diff with', type: 'quill' } }
};

export default ({
  id: 'op-richtext-diff',
  type: 'product',
  configVersion: 1,
  config,
  meta
}: productOperatorT);
