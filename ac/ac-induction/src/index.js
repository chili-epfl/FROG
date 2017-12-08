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
        partStr: '',
        properties: [],
        suffisantSets: '',
        contradictoryProperties: '',
        unnecessaryProperties: '',
        examples: []
      },
      data: []
    },
    {
      title: 'Learning about SETs',
      config: {
        title: 'SET',
        partStr: 'e3,f3,d,t3',
        definition:
          'A set is group of three objects such that if 2 objects share a property (same shape or same filling), the 3rd object must share it too.',
        properties: [
          'At least one element is not filled',
          'At most one element is filled',
          'The three elements have the same shape',
          'The three elements have the same filling',
          'The three elements have different shapes',
          'The three elements have different filling',
          'Exactly two elements have the same shape',
          'Exactly two elements have the same filling'
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

export default ({
  id: 'ac-induction',
  type: 'react-component',
  config,
  meta,
  ActivityRunner,
  mergeFunction,
  dashboard
}: ActivityPackageT);
