// @flow

import { type dataUnitStructT, type ActivityPackageT, uuid } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';

const learningItems = [
  {
    id: '1',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  }
];

const meta = {
  name: 'Brainstorm',
  shortDesc:
    'Display text items, and vote up/down. Optionally students can add new items',
  description:
    'This activity features a list of items with title and content. Items have a score attached, and are ordered by score. Students can vote up or down, and optionally add new items.',
  exampleData: [
    {
      title: 'List with some items, students not able to add',
      config: {
        text: 'This list has some items, vote them up or down',
        formBoolean: false
      },
      learningItems,
      data: ['1', '2', '3', '4']
    },
    {
      title: 'List with some items, students able to add',
      config: {
        text:
          'This list has some items, vote them up or down, and add new ones',
        formBoolean: true
      },
      learningItems,
      data: [
        { li: '1' },
        { li: '2' },
        { li: '3', tags: ['should', 'not', 'break'] },
        '4'
      ]
    }
  ]
};

const dataStructure = {};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data && Array.isArray(obj.data)) {
    obj.data.forEach(box => {
      const id = box.id || uuid();
      const item = typeof box === 'object' ? box : { li: box };
      dataFn.objInsert(
        {
          students: {},
          score: 0,
          id,
          ...item
        },
        id
      );
    });
  }
};

export default ({
  id: 'ac-brainstorm',
  type: 'react-component',
  ActivityRunner,
  config,
  meta,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
