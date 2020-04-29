// @flow

import React from 'react';

const style = {
  width: '100%',
  background: '#ddd',
  padding: '8px',
  margin: '0px'
};

export default ({ config }: Object) => (
  <div style={style}>
    <h2>{config.title || 'Coding activity'}</h2>
    <h3>{config.guidelines || 'No guidelines were given for this exercice'}</h3>
    <p>{config.specifications || ''}</p>
  </div>
);
