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

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  console.log('merge boxes', object);
  object.products.forEach(box =>
    dataFn.listAppend({
      ...box,
      x: Math.random() * 800,
      y: Math.random() * 800
    })
  );
};

export default {
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner: Board,
  Dashboard: null,
  dataStructure,
  mergeFunction
};
