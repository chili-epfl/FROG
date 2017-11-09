// @flow

import React from 'react';
import { type ActivityPackageT, ReactiveText } from 'frog-utils';

const meta = {
  name: 'Text area',
  shortDesc: 'Students can edit new or existing text',
  description: 'Can also show configurable prompt',
  exampleData: [
    {
      title: 'Case with no data or config',
      config: {},
      activityData: {}
    },
    {
      title: 'Case with title and prompt',
      config: {
        title: 'Reflection',
        prompt:
          'Please discuss how you first discovered that your parents were aliens, and how that made you feel'
      },
      activityData: {}
    },
    {
      title: 'Case with title and prompt, and incoming data',
      config: {
        title: 'Reflection',
        prompt:
          'Please discuss how you first discovered that your parents were aliens, and how that made you feel'
      },
      data: {
        text:
          'It first began a dark night in December, and included confetti and a full moon.'
      }
    }
  ]
};

const config = {
  type: 'object',
  properties: {
    title: {
      title: 'Optional title',
      type: 'string'
    },
    prompt: {
      title: 'Optional prompt',
      type: 'string'
    }
  }
};

// default empty reactive datastructure, typically either an empty object or array
const dataStructure = { text: '' };

// receives incoming data, and merges it with the reactive data using dataFn.*
const mergeFunction = (object, dataFn) => {
  if (object.data && object.data.text) {
    dataFn.objInsert(object.data.text, 'text');
  }
};

// the actual component that the student sees
const ActivityRunner = ({ activityData, dataFn }) => {
  const header = activityData.config && [
    activityData.config.title && (
      <h1 key="title">{activityData.config.title}</h1>
    ),
    activityData.config.prompt && (
      <p key="prompt" style={{ fontSize: '25px' }}>
        <i>{activityData.config.prompt}</i>
      </p>
    )
  ];
  return [
    ...header,
    <ReactiveText
      type="textarea"
      path="text"
      dataFn={dataFn}
      key="textarea"
      style={{ width: '100%', height: '100%', fontSize: '20px' }}
    />
  ];
};

export default ({
  id: 'ac-textarea',
  type: 'react-component',
  meta,
  config,
  ActivityRunner,
  Dashboard: null,
  dataStructure,
  mergeFunction
}: ActivityPackageT);
