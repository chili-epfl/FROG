// @flow

import React from 'react';

import { ExButton, DefinitionBox } from './StyledComponents';

export default ({
  title,
  hasTest,
  definition,
  dataFn,
  data,
  logger
}: Object) => {
  const tmp = data.parts.length - data.indexPart - 1;
  return (
    <div style={{ margin: '25px' }}>
      <h3> {title} </h3>
      <p>
        {' '}
        {'You have completed the ' +
          (tmp > 1 ? tmp + ' first parts' : 'first part') +
          ' of this activity.'}
        <br />{' '}
        {hasTest
          ? 'Before you start the last one (the tests without feedback), here is the definition of the concept to make sure you understood it well.'
          : 'The final definition of the concept is the following:'}
      </p>
      <DefinitionBox>{definition}</DefinitionBox>
      <ExButton
        className="btn btn-default"
        onClick={() => {
          logger({ type: 'subPart', value: 'Definition' });
          logger({ type: 'part', value: 'Definition' });
          dataFn.objInsert(data.indexPart + 1, 'indexPart');
        }}
      >
        Next
      </ExButton>
    </div>
  );
};
