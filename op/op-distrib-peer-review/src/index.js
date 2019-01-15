// @flow

import { type productOperatorT } from 'frog-utils';
import liType from './liType';

const meta = {
  name: 'Wrap for peer-review',
  shortDesc: 'Wraps LI in li-peerReview',
  description: ''
};

const config = {
  type: 'object',
  properties: {}
};

export default ({
  id: 'op-distrib-peer-review',
  type: 'product',
  configVersion: 1,
  config,
  meta,
  LearningItems: [liType]
}: productOperatorT);
