// @flow

import * as React from 'react';
import { type ActivityPackageT, ReactiveText } from 'frog-utils';
import { compact } from 'lodash';

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
    guidelines: {
      title: 'Guidelines',
      type: 'string'
    },
    prompt: {
      title: 'Default prompt',
      type: 'string'
    },
    placeholder: { title: 'Optional placeholder', type: 'string' }
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

const exportData = (configData, { payload }) => {
  const csv = Object.keys(payload).map(line => {
    const data = JSON.stringify(payload[line].data['text']);
    if (data) {
      return [line, data].join('\t');
    }
    return undefined;
  });

  const headers = ['instanceId', 'text'].join('\t');
  return compact([headers, ...csv]).join('\n');
};

// the actual component that the student sees
const ActivityRunner = ({ activityData, dataFn }) => {
  const conf = activityData.config;
  const header = conf && [
    conf.title && <h1 key="title">{conf.title}</h1>,
    conf.guidelines && (
      <p key="guidelines" style={{ fontSize: '20px' }}>
        {conf.guidelines}
      </p>
    ),
    <ul key="prompt" style={{ fontSize: '20px' }}>
      {conf.prompt && conf.prompt.split('\n').map(x => <li key={x}>{x}</li>)}
    </ul>
  ];
  return [
    ...header,
    <ReactiveText
      type="textarea"
      path="text"
      dataFn={dataFn}
      key="textarea"
      placeholder={conf && conf.placeholder}
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
  mergeFunction,
  exportData
}: ActivityPackageT);
