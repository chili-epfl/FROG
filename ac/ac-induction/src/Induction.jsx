// @flow

import React from 'react';

import { type ActivityRunnerT } from 'frog-utils';

import Images from './Images';
import Rules from './Rules';

export default ({
  // logger,
  activityData
}: // data,
// dataFn,
// userInfo
ActivityRunnerT) =>
  <div>
    <h4>{activityData.config.title}</h4>
    <Images
      srcURITrue="{activityData.config ? activityData.config.imgTrue : 'empty'}"
      srcURIFalse="{activityData.config ? activityData.config.imgFalse : 'empty'}"
    />
    <Rules />
  </div>;
