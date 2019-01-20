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
  properties: {
    responseLIType: {
      title: 'Learning Item type for response',
      type: 'learningItemTypeEditor',
      default: 'li-richText'
    },
    prompt: { title: 'Prompt', type: 'rte' }
  }
};

export default ({
  id: 'op-wrap-peer-review',
  type: 'product',
  configVersion: 1,
  config,
  meta,
  LearningItems: [liType]
}: productOperatorT);
