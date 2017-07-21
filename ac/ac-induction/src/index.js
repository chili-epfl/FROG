// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Induction';
import config from './config';

const meta = {
  name: 'Induction',
  type: 'react-component',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to cehck the rules that fit the concept",
  inputs: '',
  outputs: ''
};

export default ({
  id: 'ac-induction',
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
