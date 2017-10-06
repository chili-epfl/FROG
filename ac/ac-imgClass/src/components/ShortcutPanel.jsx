// @flow

import React from 'react';

export const shortcuts = '1234567890abcdefghijklmnopqrstuvwxyz';

export default ({ categories, dataFn, imageKey, data, assignCategory }: Object) =>
  <div className="list-group" style={{ margin: 0 }} >
    <div
      className="list-group-item"
      style={{ fontWeight: 'bold', backgroundColor: '#D0D0D0' }}
    >
      Shortcuts :
    </div>
    {categories.map((categoryName, i)=>
      <button
        key={categoryName}
        onClick={() => { assignCategory(categoryName) }}
        className="list-group-item"
      >
        {shortcuts[i]} <span className="glyphicon glyphicon-arrow-right" />
        {' ' + categoryName}
      </button>
    )}
  </div>;
