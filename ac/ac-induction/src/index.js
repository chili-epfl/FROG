// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Induction';
import config from './config';

const meta = {
  name: 'Induction',
  shortDesc: 'Reasoning by induction',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to check the rules that fit the concept.",
  exampleData: [
    {
      title: 'Empty induction',
      config: {
        title: 'Example induction',
        trueDef: [],
        falseDef: [],
        nMaxExamples: 1,
        examples: [
          {
            image:
              'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png',
            isIncorrect: false,
            whyIncorrect: 'Empty'
          }
        ]
      },
      data: []
    },
    {
      title: 'Induction with examples',
      config: {
        title: 'The square :',
        nMaxExamples: 2,
        trueDef: [
          'It has 4 sides',
          'It has 4 right angles',
          'All of its sides have the same length'
        ],
        falseDef: ["It's blue", "It's on a computer", 'Every side is 5cm long'],
        examples: [
          {
            image: 'http://www.fremontsailingclub.org/sailing/SFlag.gif',
            isIncorrect: false
          },
          {
            image:
              'https://www.pharmasystems.com/image/cache/LabelsFall2013/2555-500x500.jpg',
            isIncorrect: true,
            whyIncorrect: "It doesn't have 4 sides"
          },
          {
            image:
              'http://www.iconsdb.com/icons/preview/green/triangle-xxl.png',
            isIncorrect: true,
            whyIncorrect: "The angles aren't right"
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
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
