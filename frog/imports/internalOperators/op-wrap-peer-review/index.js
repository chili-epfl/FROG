// @flow

import { type productOperatorT } from 'frog-utils';
import liType from './liType';

const meta = {
  name: 'Wrap for peer-review',
  shortDesc: 'Wraps LI in li-peerReview',
  description: '',
  category: 'Peer-review'
};

const config = {
  type: 'object',
  properties: {
    responseLIType: {
      title: 'Learning Item type for response',
      type: 'learningItemTypeEditor',
      default: 'li-richText'
    },
    prompt: { title: 'Prompt', type: 'rte' },
    distribute: { title: 'Distribute round-robin fashion', type: 'boolean' },
    count: {
      title: 'Max number of items to send to each recipient',
      type: 'number',
      default: 1
    },
    offset: { title: 'Offset of round-robin distribution', type: 'number' }
  }
};

const configUI = {
  count: { conditional: 'distribute' },
  offset: { conditional: 'distribute' }
};

const validateConfig = [
  formData =>
    formData.count &&
    (formData.count < 1 || Math.round(formData.count) !== formData.count)
      ? { err: 'Count must be a positive integer' }
      : null,
  formData =>
    formData.offset &&
    (formData.offset < 1 || Math.round(formData.offset) !== formData.offset)
      ? { err: 'Offset must be a positive integer' }
      : null
];

export default ({
  id: 'op-wrap-peer-review',
  type: 'product',
  configVersion: 1,
  config,
  configUI,
  validateConfig,
  meta,
  LearningItems: [liType]
}: productOperatorT);
