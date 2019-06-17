// @flow

import React from 'react';
import LI from '../LearningItem';
import { connection } from '../App/connection';
import { generateReactiveFn } from '/imports/api/generateReactiveFn';
import Creator from './Creator';
import Display from './Display';

type SingleActivityPropsT = {
  match: {
    params: {
      slug?: string
    }
  }
}

const liConnection = connection.get('li');

export const dataFn = generateReactiveFn(liConnection, LI, {
  createdByUser: Meteor.userId()
});

export const LearningItem = dataFn.LearningItem;

const SingleActivity = (props: SingleActivityPropsT) => {
  if(props.match.params.slug)
    return <Display slug={props.match.params.slug} />;
  else
    return <Creator />;
}

export default SingleActivity;