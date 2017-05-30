import React from 'react';

export const meta = {
  name: 'Embedded website',
  type: 'react-component'
};

export const config = {
  type: 'object',
  properties: {
    url: {
      type: 'string',
      title: 'URL of website'
    }
  }
};

export const ActivityRunner = ({ configData }) => (
  <iframe src={configData.url} style={{width:'100%', height:'100%', overflow:'auto'}} />
);

export default {
  id: 'ac-iframe',
  ActivityRunner,
  config,
  meta
};
