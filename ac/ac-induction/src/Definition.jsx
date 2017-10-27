// @flow

import React from 'react';

import { ExButton } from './StyledComponents';

export default ({ title, hasTest, definition, dataFn, data }: Object) => {
  const tmp = data.parts.length - data.indexPart - 1;
  return (
    <div style={{ margin: '25px' }}>
      <h3> {title} </h3>
      <p>
        {' '}
        {'You have completed the ' +
          (tmp > 1 ? tmp + ' parts' : 'first part') +
          ' of this activity.'}
        <br />{' '}
        {hasTest
          ? 'Before you start the last part which is a test without feedback, here is the definition of the concept to make sure you understood it well.'
          : 'The final definition of the concept is the following:'}
      </p>
      <p>{definition}</p>
      <ExButton
        className="btn btn-default"
        onClick={() => dataFn.objInsert(data.indexPart + 1, 'indexPart')}
      >
        Next
      </ExButton>
    </div>
  );
};
