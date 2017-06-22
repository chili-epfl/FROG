// @flow

import { type ActivityPackageT } from 'frog-utils';

import Board from './board';

const meta = {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab'
};

const config = {
  type: 'object',
  properties: {
    quadrants: {
      title: 'Draw four quadrants, named as below',
      type: 'boolean'
    },
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
    },
    boxes: {
      title: 'Initial boxes',
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
  [...(object.config.boxes || []), ...object.data].forEach(box =>
    dataFn.listAppend({
      ...box,
      x: Math.random() * 400,
      y: Math.random() * 400
    })
  );
};

export default ({
  id: 'ac-ck-board',
  meta,
  config,
  ActivityRunner: Board,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
