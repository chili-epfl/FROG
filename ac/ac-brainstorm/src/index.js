// @flow

import { type dataUnitStructT, type ActivityPackageT } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';
import Dashboard from './Dashboard';

const listItems = [
  { id: '1', score: 0, title: 'AirBnB', content: 'Uber for hotels' },
  { id: '2', score: 1, title: 'Uber', content: 'AirBnB for taxis' },
  { id: '3', score: 4, title: 'Amazon Alexa', content: 'AskJeeves for speech' }
];

const meta = {
  name: 'Brainstorm',
  shortDesc:
    'Display text items, and vote up/down. Optionally students can add new items',
  description:
    'This activity features a list of items with title and content. Items have a score attached, and are ordered by score. Students can vote up or down, and optionally add new items.',
  exampleData: [
    {
      title: 'Empty list',
      config: {
        text: 'This is an empty list, please fill it up',
        formBoolean: true
      },
      data: {}
    },
    {
      title: 'List with some items, students not able to add',
      config: {
        text: 'This list has some items, vote them up or down',
        formBoolean: false
      },
      data: listItems
    },
    {
      title: 'List with some items, students able to add',
      config: {
        text:
          'This list has some items, vote them up or down, and add new ones',
        formBoolean: true
      },
      data: listItems
    }
  ]
};

const dataStructure = [];

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data && Array.isArray(obj.data)) {
    obj.data.forEach(box =>
      dataFn.objInsert({ score: 0, ...box, students: {} }, box.id)
    );
  }
};

export default ({
  id: 'ac-brainstorm',
  type: 'react-component',
  ActivityRunner,
  Dashboard,
  config,
  meta,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
