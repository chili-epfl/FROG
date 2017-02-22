import React from 'react';
import ReactIframe from 'react-iframe';

export const meta = {
  name: 'Embedded website',
  type: 'react-component'
};

export const config = {
  title: 'Configuration for Embedded website',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Activity name'
    },
    duration: {
      type: 'number',
      title: 'Duration in seconds (0 for infinity)'
    },
    url: {
      type: 'string',
      title: 'URL of website'
    }
  }
};

export const ActivityRunner = ({ config }) => (
  <div>
    <iframe src={config.url} width={750} height={600} />
  </div>
);

export default {
  id: 'ac-iframe',
  ActivityRunner,
  config,
  meta
};
