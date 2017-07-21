// @flow

import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';

import { connect } from './store';
import { Activities, Operators, Connections } from '../../api/activities';
import valid from '../../api/validGraphFn';

const ListError = ({ errors }) =>
  <g>
    {errors.map((x, i) => {
      const k = i * 2;
      return (
        <text x="90" y={40 + 20 * i} key={x.id + k}>
          {' '}{'• ' + x.err}{' '}
        </text>
      );
    })}
  </g>;

export const ErrorList = connect(
  ({ store: { graphErrors, ui: { showErrors } } }) =>
    showErrors && graphErrors.length > 0
      ? <g>
          <rect
            x="80"
            y="20"
            rx="20"
            ry={5 + 5 * graphErrors.length}
            width={
              8 *
              graphErrors
                .map(x => x.err.length)
                .reduce((acc, x) => (x > acc ? x : acc))
            }
            height={5 + 22 * graphErrors.length}
            fill="#FFFFFF"
            stroke="#CA1A1A"
          />
          <ListError errors={graphErrors} />
        </g>
      : null
);

export const ValidButton = connect(
  ({ store: { graphErrors, ui: { showErrors, setShowErrors } } }) =>
    <svg width="34px" height="34px" style={{ overflow: 'visible' }}>
      <circle
        cx="17"
        cy="17"
        r="12"
        stroke="transparent"
        fill={graphErrors.length > 0 ? 'red' : 'green'}
        onMouseOver={() => setShowErrors(true)}
        onMouseOut={() => setShowErrors(false)}
      />
    </svg>
);
