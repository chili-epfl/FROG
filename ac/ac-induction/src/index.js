// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './ActivityRunner';
import config from './config';
import mergeFunction from './mergeFun';
import dashboard from './Dashboard';
import exampleData from './exampleData';

const meta = {
  name: 'Induction',
  shortDesc: 'Reasoning by induction',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to check the rules that fit the concept.",
  exampleData
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
