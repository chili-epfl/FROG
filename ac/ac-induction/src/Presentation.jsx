// @flow

import React from 'react';

import { PresButton } from './StyledComponents';

export default ({ title, dataFn, data, logger }: Object) => (
  <div style={{ margin: '25px' }}>
    <h3> {title} </h3>
    <div>
      In this activity, you will learn the concept of {title}
      <br />
      You are going to complete the following activities:
      <ol>
        {data.parts.filter(p => p !== 'Presentation').map(x => {
          const count =
            x === 'Examples'
              ? data.listIndexEx.length
              : x === 'Tests with feedback'
                ? data.listIndexTestWithFeedback.length
                : x === 'Tests' ? data.listIndexTest.length : null;
          return (
            <li key={x}>
              {x}
              {count && ' (' + count + ')'}
            </li>
          );
        })}
      </ol>
    </div>
    <PresButton
      className="btn btn-default"
      onClick={() => {
        dataFn.objInsert(data.indexPart + 1, 'indexPart');
        logger({ type: 'subPart', value: 'Presentation' });
        logger({ type: 'part', value: 'Presentation' });
      }}
    >
      Start the activity
    </PresButton>
  </div>
);
