// @flow

import React from 'react';

export default ({ title, parts, dataFn, data }: Object) => {
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
          {parts.filter(p => p !== 'Presentation').map(x =>
            <li key={x}>
              {x}
            </li>
          )}
        </ol>
      </div>
      <button
        className="btn btn-default"
        onClick={() => dataFn.objInsert(data.index + 1, 'index')}
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '50px'
        }}
      >
        {' '}Start the activity{' '}
      </button>
    </div>
  );
};
