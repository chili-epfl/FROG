// @flow

import React from 'react';

export default ({ config, style }: Object) => (
  <div style={style}>
    <h2>{config.title || 'Coding activity'}</h2>
    <h3>{config.guidelines || 'No guidelines were given for this exercice'}</h3>
    <h3>{config.specifications || ''}</h3>
  </div>
);
