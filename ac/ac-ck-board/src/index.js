// @flows

import Board from './board';

const meta = {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab'
};

const config = {
  type: 'object',
  properties: {
    boxes: {
      title: 'Boxes',
      type: 'array',
      items: {
        type: 'object',
        title: 'Box',
        properties: {
          title: {
            type: 'string',
            title: 'Title'
          },
          content: {
            type: 'string',
            title: 'Content'
          }
        }
      }
    }
  }
};

export default {
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner: Board,
  Dashboard: null
};
