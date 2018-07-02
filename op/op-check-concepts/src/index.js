// @flow

import type { productOperatorT } from 'frog-utils';

const meta = {
  name: 'Provide feedback based on concepts in text',
  shortName: 'Feedback',
  shortDesc: 'Group students to argue',
  description: 'Group students with as many similar answers as possible.'
};

const config = {
  type: 'object',
  properties: {
    concepts: {
      type: 'array',
      title: 'Concepts',
      items: {
        type: 'object',
        required: ['keyword', 'prompt'],
        properties: {
          keyword: {
            type: 'string',
            title:
              'Keywords to look for in text, comma separated, * for any letters until space, for example creat* matches creation and creativity'
          },
          prompt: {
            type: 'string',
            title: 'Prompt to provide if keywords are missing'
          }
        }
      }
    }
  }
};

export default ({
  id: 'op-check-concepts',
  type: 'product',
  config,
  meta
}: productOperatorT);
