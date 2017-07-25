// @flow

import { type ActivityPackageT, uuid } from 'frog-utils';

import Board from './board';

const meta = {
  name: 'Common Knowledge board',
  type: 'react-component',
  mode: 'collab',
  shortDesc: '2D board for placing items',
  description:
    'All imported items are placed on a 2D space. Optionally, teacher can designate four named quadrants. Students can drag boxes to organize or group ideas. Incoming items have title and content.',
  exampleData: [
    {
      title: 'Board with two boxes',
      config: { quadrants: false },
      data: [
        { title: 'Box 1', content: 'Contents of box 1' },
        { title: 'Box 2', content: 'Contents of box 2' }
      ]
    },
    {
      title: 'Quadrants and boxes',
      config: {
        quadrants: true,
        quadrant1: 'Capitalism',
        quadrant2: 'Socialism',
        quadrant3: 'Modernism',
        quadrant4: 'Post-modernism'
      },
      data: [
        { title: 'Van Gogh', content: 'Painter' },
        { title: 'Marx', content: 'Thinker' },
        { title: 'Gramsci', content: 'Italian thinker' },
        { title: 'Friedman', content: 'Economist' }
      ]
    }
  ]
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
  [...(object.config.boxes || []), ...object.data].forEach(box => {
    if (!box.id) {
      box.id = uuid();
    }
    return dataFn.listAppend({
      ...box,
      x: Math.random() * 400,
      y: Math.random() * 400
    });
  });
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
