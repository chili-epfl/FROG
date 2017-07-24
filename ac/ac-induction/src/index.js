// @flow

import { type ActivityPackageT } from 'frog-utils';

import ActivityRunner from './Induction';
import config from './config';

const meta = {
  name: 'Induction',
  type: 'react-component',
  shortDesc: 'Reasoning by induction',
  description:
    "The student has an image that corresponds to the concept he needs to define an one that doens't and he has to check the rules that fit the concept."
};

export default ({
  id: 'ac-induction',
  meta,
  config,
  ActivityRunner,
  Dashboard: null
}: ActivityPackageT);
