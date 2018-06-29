// @flow
import { type productOperatorT } from 'frog-utils';

export const meta = {
  name: 'Get ideas from Hypothesis',
  shortName: 'Hypothesis',
  shortDesc: 'Get ideas from Hypothesis API',
  description: 'Collect ideas from an Hypothesis API by hashtag or document id.'
};

export const config = {
  type: 'object',
  properties: {
    tag: {
      type: 'string',
      title: 'Hashtag'
    },
    url: {
      type: 'string',
      title: 'URL'
    }
  }
};
const validateConfig = [
  formData =>
    formData.tag || formData.url ? null : { err: 'You need either tag or URL' }
];

export default ({
  id: 'op-hypothesis',
  type: 'product',
  config,
  validateConfig,
  meta
}: productOperatorT);
