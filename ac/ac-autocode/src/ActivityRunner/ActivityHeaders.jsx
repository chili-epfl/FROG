// @flow

import React from 'react';

export default ({ config }: Object) => (
  <div>
    <h2>{config.title || 'Coding activity'}</h2>
    <h3>{config.guidelines || 'No guidelines were given for this exercice'}</h3>
  </div>
);
