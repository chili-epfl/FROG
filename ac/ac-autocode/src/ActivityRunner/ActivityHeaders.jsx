// @flow

import React from 'react';

const ActivityHeaders = (config: Object) => (
  <div>
    <h2>{config.title || 'Coding activity'}</h2>
    <h3>{config.guidelines || 'No guidelines were given for this exercice'}</h3>
    <h3>
      {config.specifications ||
        'No specifications were given for this exercice'}
    </h3>
  </div>
);

export default ActivityHeaders;
