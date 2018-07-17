// @flow

import * as React from 'react';
import { wordWrap } from 'frog-utils';
import { blue } from '@material-ui/core/colors';

import { connect } from './store';

const ListError = ({ errors, maxLength }) => {
  let lines = 0;
  return (
    <g>
      {errors.map(x => {
        const textlines = wordWrap(x.err, maxLength);
        const k = lines;
        lines += textlines.length;
        return [
          <text
            x="90"
            y={40 + 20 * k}
            key={k + 'dot'}
            fill={x.severity === 'error' ? 'red' : 'orange'}
          >
            •
          </text>,
          <g key={k + 'g'}>
            {textlines.map((line, y) => (
              <text
                x="100"
                y={40 + 20 * (k + y)}
                key={k + line}
                fill={x.severity === 'error' ? 'red' : 'orange'}
              >
                {line}
              </text>
            ))}
          </g>
        ];
      })}
    </g>
  );
};

export const ErrorList = connect(
  ({
    store: {
      graphErrors,
      ui: { showErrors },
      activityStore: { all: activities },
      operatorStore: { all: operators }
    },
    activityId
  }) => {
    // component not open
    if (showErrors !== true && showErrors !== activityId) {
      return null;
    }

    // being called from the wrong place
    if (activityId && showErrors === true) {
      return null;
    }

    let errors;
    if (showErrors === true) {
      errors = graphErrors.map(x => {
        const nodeName =
          x.nodeType === 'activity'
            ? activities.find(y => y.id === x.id).title
            : operators.find(y => y.id === x.id).title;
        return {
          ...x,
          err: `${x.nodeType} ${nodeName || 'unnamed'}: ${x.err}`
        };
      });
    } else {
      errors = graphErrors.filter(x => x.id === activityId);
    }
    return <ShowErrorsRaw errors={errors} global={showErrors === true} />;
  }
);

ErrorList.displayName = 'ErrorList';

export const ShowErrorsRaw = ({
  errors,
  global
}: {
  errors: Object[],
  global?: boolean
}) => {
  if (errors.length === 0) {
    return null;
  }
  const maxLength = global ? 130 : 60;
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
};

export const ValidButtonRaw = ({
  graphErrorColor,
  setShowErrors,
  errorColor,
  activityId
}: {
  graphErrorColor?: string,
  setShowErrors: Function,
  errorColor: string,
  activityId?: string
}) => (
  <svg
    width="34px"
    height="34px"
    style={{ overflow: 'visible', position: 'fixed', top: 60, left: 250 }}
  >
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

export const ValidButton = connect(
  ({
    store: {
      ui: { graphErrorColor, setShowErrors }
    },
    errorColor,
    activityId
  }) => (
    <svg width="34px" height="34px" style={{ overflow: 'visible' }}>
      <circle
        cx="17"
        cy="17"
        r="15"
        stroke={blue[500]}
        strokeWidth="3"
        fill={errorColor || graphErrorColor}
        onMouseOver={() => setShowErrors(activityId || true)}
        onMouseOut={() => setShowErrors(false)}
      />
      <circle
        cx="17"
        cy="17"
        r="14"
        stroke="white"
        fill="none"
        strokeWidth="2"
      />
    </svg>
    // <ValidButtonRaw
    //   graphErrorColor={graphErrorColor}
    //   setShowErrors={setShowErrors}
    //   errorColor={errorColor}
    //   activityId={activityId}
    // />
  )
);

ValidButton.displayName = 'ValidButton';
