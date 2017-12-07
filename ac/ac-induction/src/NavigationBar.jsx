// @flow

import React from 'react';

import { NavLi } from './StyledComponents';

export default ({ data }: Object) => (
  <ul className="nav nav-tabs">
    {data.parts &&
      data.parts.map((x, i) => (
        <NavLi
          key={i.toString() + x[0]}
          className={data.indexPart === i ? 'active' : ''}
          style={{ width: 100 / data.parts.length + '%' }}
        >
          <a
            style={{
              backgroundColor: data.indexPart === i ? '#A0A0F0' : '',
              color: 'black'
            }}
          >
            {data.indexPart === i
              ? 'Part ' +
                i +
                ': ' +
                x[0] +
                (x[1] > 1
                  ? ' (' + (data.indexCurrent + 1) + '/' + x[1] + ')'
                  : '')
              : 'Part ' + i + ': ' + x[0]}
          </a>
        </NavLi>
      ))}
  </ul>
);
