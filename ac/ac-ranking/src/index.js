// @flow

import { type dataUnitStructT, type ActivityPackageT } from 'frog-utils';

import { config } from './config';
import ActivityRunner from './ActivityRunner';
// import Dashboard from './Dashboard';

const meta = {
  name: 'Ranking Activity',
  shortDesc: 'Prompt that allows the student to rank a set of answers.',
  description:
    'Students are able to provide a set of rankings for a given prompt.',
  exampleData: [
    {
      title: 'Train Interface',
      config: {
        title: 'Which interface is the best',
        guidelines: 'Please drag the items in order.',
        justify: false,
        shuffle: false,
        answers: [
          { choice: 'Command' },
          { choice: 'Drag and Drop' },
          { choice: 'Graphical' },
          { choice: 'Form' }
        ]
      },
      data: [
        // need to edit the data to what I want
        { id: 'a', rank: 1, title: 'AirBnB' },
        { id: 'b', rank: 2, title: 'Uber' },
        { id: 'c', rank: 3, title: 'Amazon Alexa' }
      ]
    }
  ]
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {
  justification: '',
  rankedAnswers: {},
  initialAnswers: []
};

const mergeFunction = (obj: dataUnitStructT, dataFn: Object) => {
  if (obj.data && Array.isArray(obj.data)) {
    obj.data.forEach(box => {
      dataFn.objInsert({ rank: 0, ...box }, ['rankedAnswers', box.id]);
    });
  }
  if (obj.config.answers && Array.isArray(obj.config.answers)) {
    obj.config.answers.forEach(ans => {
      dataFn.listAppend(ans.choice, ['initialAnswers']);
    });
  }
};

export default ({
  id: 'ac-ranking',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
