// @flow

import React from 'react';
import { type ActivityPackageT } from 'frog-utils';

const meta = {
  name: 'Auto-graded coding',
  type: 'react-component',
  shortDesc: 'Autograded code snippets',
  description: 'Students upload code wich is tested against teacher-designed tests',
  exampleData: [
    { title: 'Case with no data', config: { title: 'Default title' }, data: {} }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      title: 'Title of the activity'
    },
    guidelines: {
      type: 'string',
      title: 'Guidelines'
    }

  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = {};

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {};

// the actual component that the student sees
const ActivityRunner = ({ logger, activityData, data, dataFn, userInfo }) =>{
  return(
    <div>
      <h1>
        {activityData.config.title || 'Coding exercise'}
      </h1>
      <p>
        {activityData.config.guidelines || 'Instructions for the exercise'}
      </p>
      <textarea name="textarea" rows="20" cols="80">Write your code here</textarea>
      <button type="button">Submit</button>
    </div>
  );
};

export default ({
  id: 'ac-autocode',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
