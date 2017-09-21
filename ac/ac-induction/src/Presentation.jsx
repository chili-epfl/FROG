// @flow

import React from 'react';

import { PresButton } from './StyledComponents';

export default ({ title, dataFn, data }: Object) => {
  console.log('presentation');
  return (
    <div style={{ margin: '25px' }}>
      <h3>
        {' '}{title}{' '}
      </h3>
      <div>
        {"In this activity, you will learn the concept '" +
          title +
          "' by induction :\n to do so, you are going to complete the following part(s) of the activity :"}
        <ol>
          {data.parts.filter(p => p !== 'Presentation').map(x =>
            <li key={x}>
              {x}
            </li>
          )}
        </ol>
      </div>
      <PresButton
        className="btn btn-default"
        onClick={() => dataFn.objInsert(data.indexPart + 1, 'indexPart')}
      >
        {' '}Start the activity{' '}
      </PresButton>
    </div>
  );
};
