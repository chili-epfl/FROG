// @flow

import type { ActivityPackageT } from 'frog-utils';

import config from './config';
import ActivityRunner from './ActivityRunner';

const exampleConfig = {
  collab: false,
  justifications: false,
  MCQ: [
    {
      question: 'I will learn more if I...',
      answers: [
        { answer: 'By solving exercise alone' },
        { answer: 'By solving exercise with other students' }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        { answer: 'Ask questions to the professor' },
        { answer: 'Answer the questions of my fellow student' }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer:
            'Solve exercises with an other student who has the same level as me'
        },
        { answer: 'Solve exercise with a weaker student' }
      ]
    },
    {
      question: 'I will learn more if I...',
      answers: [
        {
          answer:
            'Solve exercises with an other student who has the same level as me'
        },
        { answer: 'Solve exercise with a stronger student' }
      ]
    }
  ]
};

export const meta = {
  name: 'Multiple-Choice Questions',
  type: 'react-component',
  shortDesc: 'Filling a MCQ form',
  description: 'Display a multiple-choice questions form.',
  exampleData: [
    {
      config: exampleConfig,
      title: 'Sample MCQ',
      activityData: {}
    }
  ]
};

export default ({
  id: 'ac-quiz',
  meta,
  config,
  ActivityRunner
}: ActivityPackageT);
