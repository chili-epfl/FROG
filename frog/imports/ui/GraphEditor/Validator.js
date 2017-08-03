// @flow

import React from 'react';
import { wordWrap } from 'frog-utils';

import { connect } from './store';

const ListError = ({ errors, maxLength }) => {
  let lines = 0;
  return (
    <g>
      {errors.map((x, i) => {
        const textlines = wordWrap(x.err, maxLength);
        const k = lines;
        lines = lines + textlines.length;
        return [
          <text
            x="90"
            y={40 + 20 * k}
            key={x.id + k + ' ' + i + 'dot'}
            fill={x.severity === 'error' ? 'red' : 'orange'}
          >
            •
          </text>,
          <g>
            {textlines.map((line, y) =>
              <text
                x="100"
                y={40 + 20 * (k + y)}
                key={x.id + k + ' ' + i + y}
                fill={x.severity === 'error' ? 'red' : 'orange'}
              >
                {line}
              </text>
            )}
          </g>
        ];
      })}
    </g>
  );
};

export const ErrorList = connect(
  ({ store: { graphErrors, ui: { showErrors } }, activityId }) => {
    if (showErrors !== true && showErrors !== activityId) {
      return null;
    }

    if (activityId && showErrors === true) {
      return null;
    }
    const errors =
      showErrors === true
        ? graphErrors
        : graphErrors.filter(x => x.id === activityId);
    if (errors.length === 0) {
      return null;
    }
    const maxLength = showErrors === true ? 130 : 60;
    const textLength = errors
      .map(x => wordWrap(x.err, maxLength))
      .reduce((acc, x) => acc + x.length, 0);
    return (
      <svg style={{ overflow: 'visible' }}>
        <g>
          <rect
            x="80"
            y="20"
            rx="20"
            ry={5 + 5 * textLength}
            width={6.5 * maxLength}
            height={5 + 22 * textLength}
            fill="#FFFFFF"
            stroke="#CA1A1A"
          />
          <ListError errors={errors} maxLength={maxLength} />
        </g>
      </svg>
    );
  }
);

export const ValidButton = connect(
  ({
    store: { ui: { graphErrorColor, setShowErrors } },
    errorColor,
    activityId
  }) =>
    <svg width="34px" height="34px" style={{ overflow: 'visible' }}>
      <circle
        cx="17"
        cy="17"
        r="12"
        stroke="transparent"
        fill={errorColor || graphErrorColor}
        onMouseOver={() => setShowErrors(activityId || true)}
        onMouseOut={() => setShowErrors(false)}
      />
    </svg>
);
