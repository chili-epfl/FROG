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
    quadrant1: {
      title: 'Quadrant 1 title',
      type: 'string'
    },
    quadrant2: {
      title: 'Quadrant 2 title',
      type: 'string'
    },
    quadrant3: {
      title: 'Quadrant 3 title',
      type: 'string'
    },
    quadrant4: {
      title: 'Quadrant 4 title',
      type: 'string'
    }
  }
};

const dataStructure = [];

const mergeFunction = (object, dataFn) => {
  object.products.forEach(box =>
    dataFn.listAppend({
      ...box,
      x: Math.random() * 400,
      y: Math.random() * 400
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
