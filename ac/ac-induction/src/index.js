// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import config from './config';
import mergeFunction from './mergeFun';
import dashboard from './Dashboard';

const meta = {
  name: 'Induction',
  shortDesc: 'Reasoning by induction',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to check the rules that fit the concept.",
  exampleData: [
    {
      title: 'Empty induction',
      config: {
        title: 'Empty induction',
        hasExamples: false,
        hasTestWithFeedback: false,
        hasDefinition: false,
        hasTest: false,
        examples: []
      },
      data: []
    },
    {
      title: 'Induction with examples',
      config: {
        title: 'The square',
        hasExamples: true,
        nbExamples: 3,
        hasTestWithFeedback: true,
        nbTestFeedback: 2,
        hasDefinition: true,
        definition:
          'A square is a regular quadrilateral, which means that it has four equal sides and four equal angles (90-degree angles, or right angles). It can also be defined as a rectangle in which two adjacent sides have equal length.',
        hasTest: true,
        nbTest: 4,
        examples: [
          {
            url: 'http://www.fremontsailingclub.org/sailing/SFlag.gif',
            isIncorrect: false
          },
          {
            url:
              'https://www.pharmasystems.com/image/cache/LabelsFall2013/2555-500x500.jpg',
            isIncorrect: true,
            whyIncorrect: "It doesn't have 4 sides"
          },
          {
            url: 'http://www.iconsdb.com/icons/preview/green/triangle-xxl.png',
            isIncorrect: true,
            whyIncorrect: "The angles aren't right"
          }
        ]
      },
      data: []
    }
  ]
};

const configUI = {
  nbExamples: { conditional: 'hasExamples' },
  nbTestFeedback: { conditional: 'hasTestWithFeedback' },
  definition: { conditional: 'hasDefinition' },
  nbTest: { conditional: 'hasTest' }
};

export default ({
  id: 'ac-induction',
  type: 'react-component',
  config,
  configUI,
  meta,
  ActivityRunner,
  mergeFunction,
  dashboard
}: ActivityPackageT);
