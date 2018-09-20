// @flow

import {
  type dataUnitStructT,
  type ActivityPackageT,
  uuid,
  values
} from 'frog-utils';
import { isObject } from 'lodash';

import { config, configUI } from './config';

const learningItems = [
  {
    id: '1d',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2d',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3d',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4d',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  },

  {
    id: '1a',
    liType: 'li-idea',
    payload: { title: 'Hi', content: 'Hello' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '2b',
    liType: 'li-idea',
    payload: { title: 'Uber', content: 'AirBnB for taxis' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '3c',
    liType: 'li-idea',
    payload: { title: 'Amazon Alexa', content: 'AskJeeves for speech' },
    createdAt: '2018-05-10T12:02:07.525Z'
  },
  {
    id: '4d',
    liType: 'li-image',
    payload: {
      url: 'https://i.imgur.com/pfZAxeTb.jpg',
      thumburl: 'https://i.imgur.com/pfZAxeTb.jpg'
    },
    createdAt: '2018-05-10T12:05:08.700Z'
  },

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
  },
  {
    id: '5',
    liType: 'li-spreadsheet',
    payload: [
      [
        { readOnly: true, value: '                ' },
        { readOnly: true, value: 'A' },
        { readOnly: true, value: 'B' },
        { readOnly: true, value: 'C' },
        { readOnly: true, value: 'D' }
      ],
      [
        { readOnly: true, value: 1 },
        { value: '', key: 'A1', col: 1, row: 1 },
        { value: '', key: 'B1', col: 2, row: 1 },
        { value: '', key: 'C1', col: 3, row: 1 },
        { value: '', key: 'D1', col: 4, row: 1 }
      ],
      [
        { readOnly: true, value: 2 },
        { value: '', key: 'A2', col: 1, row: 2 },
        { value: '', key: 'B2', col: 2, row: 2 },
        { value: '', key: 'C2', col: 3, row: 2 },
        { value: '', key: 'D2', col: 4, row: 2 }
      ],
      [
        { readOnly: true, value: 3 },
        { value: '', key: 'A3', col: 1, row: 3 },
        { value: '', key: 'B3', col: 2, row: 3 },
        { value: '', key: 'C3', col: 3, row: 3 },
        { value: '', key: 'D3', col: 4, row: 3 }
      ],
      [
        { readOnly: true, value: 4 },
        { value: '', key: 'A4', col: 1, row: 4 },
        { value: '', key: 'B4', col: 2, row: 4 },
        { value: '', key: 'C4', col: 3, row: 4 },
        { value: '', key: 'D4', col: 4, row: 4 }
      ]
    ],
    createdAt: '2018-09-19T09:45:37.317Z',
    draft: false
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
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4' },
        a5: { id: 'a5', li: '5' }
      }
    },
    {
      title: 'List with some items, students able to add',
      config: {
        text:
          'This list has some items, vote them up or down, and add new ones',
        formBoolean: true
      },
      learningItems,
      data: {
        a1: { id: 'a1', li: '1' },
        a2: { id: 'a2', li: '2' },
        a3: { id: 'a3', li: '3' },
        a4: { id: 'a4', li: '4', tags: ['should', 'not', 'break'] }
      }
    }
  ]
};

const dataStructure = {};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (isObject(obj?.data)) {
    values(obj.data).forEach(x => {
      const id = uuid();
      dataFn.objInsert(
        {
          students: {},
          score: 0,
          ...x,
          id
        },
        id
      );
    });
  }
};

export default ({
  id: 'ac-brainstorm',
  type: 'react-component',
  configVersion: 1,
  config,
  configUI,
  meta,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
