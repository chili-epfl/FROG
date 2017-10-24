// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import config from './config';
import mergeFunction from './mergeFun';

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
        properties: [],
        suffisantSets: '',
        contradictoryProperties: '',
        unnecessaryProperties: '',
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
          'A set is correct if when 2 objects share a property, the 3rd one shares it too.',
        hasTest: true,
        nbTest: 4,
        properties: [
          'at least one is not filled',
          'at most one is filled',
          'they all have the same shape',
          'they all have the same color',
          'they all have the different shapes',
          'they all have the different colors',
          'exactly 2 have the same shape',
          'exactly 2 have the same color'
        ],
        suffisantSets: '{2,3},{2,5},{3,4},{5,4}',
        contradictoryProperties: '6,7',
        unnecessaryProperties: '0,1,2,3,4,5',
        examples: [
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img000.png',
            isIncorrect: false,
            respectedProperties: '0,1,2,3'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img006.png',
            isIncorrect: true,
            respectedProperties: '0,1,2,7'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img012.png',
            isIncorrect: false,
            respectedProperties: '0,1,3,4'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img032.png',
            isIncorrect: true,
            respectedProperties: '0,1,6,7'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img038.png',
            isIncorrect: true,
            respectedProperties: '0,1,5,6'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img048.png',
            isIncorrect: false,
            respectedProperties: '0,1,4,5'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img063.png',
            isIncorrect: false,
            respectedProperties: '0,1,2,6'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img133.png',
            isIncorrect: true,
            respectedProperties: '0,6,7'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img384.png',
            isIncorrect: true,
            respectedProperties: '0,4,7'
          },
          {
            url:
              'https://raw.githubusercontent.com/romainAA/imagesSetSP/master/ImagesTest/img433.png',
            isIncorrect: true,
            respectedProperties: '3,6'
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
  Dashboard: null
}: ActivityPackageT);
