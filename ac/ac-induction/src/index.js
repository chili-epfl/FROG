// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Induction';
import config from './config';

const meta = {
  name: 'Induction',
  type: 'react-component',
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
        imgTrue:
          'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png',
        imgFalse:
          'https://blog.stylingandroid.com/wp-content/themes/lontano-pro/images/no-image-slide.png'
      },
      data: []
    },
    {
      title: 'Induction with imgs and defs',
      config: {
        title: 'The square :',
        trueDef: [
          'It has 4 sides',
          'It has 4 right angles',
          'All of its sides have the same length'
        ],
        falseDef: ["It's blue", 'It has no edges'],
        imgTrue: 'http://www.fremontsailingclub.org/sailing/SFlag.gif',
        imgFalse:
          'https://www.pharmasystems.com/image/cache/LabelsFall2013/2555-500x500.jpg'
      },
      data: []
    }
  ]
};

export default ({
  id: 'ac-induction',
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
