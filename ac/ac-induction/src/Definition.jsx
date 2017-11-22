// @flow

import React from 'react';

import { ExDiv, ExButton, DefinitionBox } from './StyledComponents';

export default ({
  title,
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
        {'You have completed the ' +
          (tmp > 1 ? tmp + ' first parts' : 'first part') +
          ' of this activity.'}
        <br />
        The final definition of the concept is the following:
      </p>
      <DefinitionBox>{definition}</DefinitionBox>
      <ExDiv style={{ position: 'absolute', bottom: '20px', width: '100%' }}>
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
      </ExDiv>
    </div>
  );
};
