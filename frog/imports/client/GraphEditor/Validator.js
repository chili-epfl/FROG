// @flow

import * as React from 'react';
import { wordWrap } from '/imports/frog-utils';

import { connect } from './store';

const ListError = ({ errors, maxLength, offset }) => {
  let lines = 0;
  return (
    <g>
      {errors.map(x => {
        const textlines = wordWrap(x.err, maxLength);
        const k = lines;
        lines += textlines.length;
        return [
          <g key={k + 'g'}>
            {textlines.map((line, y) => (
              <text
                x={maxLength === 130 ? 20 : 80 + 20}
                y={offset ? 20 + 20 * (k + y) : 40 + 20 * (k + y)}
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
    activityId,
    offset
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
    return (
      <ShowErrorsRaw
        errors={errors}
        global={showErrors === true}
        offset={offset}
      />
    );
  }
);

ErrorList.displayName = 'ErrorList';

export const ShowErrorsRaw = ({
  errors,
  global,
  offset
}: {
  errors: Object[],
  global?: boolean,
  offset?: boolean
}) => {
  if (errors.length === 0) {
    return null;
  }
  const maxLength = global ? 130 : 50;
  const textLength = errors
    .map(x => wordWrap(x.err, maxLength))
    .reduce((acc, x) => acc + x.length, 0);
  return (
    <svg
      width={6.5 * maxLength}
      style={{
        overflow: 'visible',
        width: `${6.5 * maxLength}px`,
        zIndex: '1000'
      }}
    >
      <g>
        <rect
          x={offset ? '0' : '80'}
          y={offset ? '0' : '24'}
          rx="5"
          ry="5"
          width={6.5 * maxLength}
          height={5 + 22 * textLength}
          fill="#FFFFFF"
          stroke="#EAEAEA"
        />
        <ListError errors={errors} maxLength={maxLength} offset={offset} />
      </g>
    </svg>
  );
};

export const ValidButtonRaw = ({
  graphErrorColor,
  setShowErrors,
  errorColor,
  activityId,
  noOffset
}: {
  graphErrorColor?: string,
  setShowErrors: Function,
  errorColor: string,
  activityId?: string,
  noOffset?: boolean
}) => (
  <svg
    width="24px"
    height="24px"
    style={
      noOffset
        ? { zIndex: '100' }
        : {
            zIndex: '100'
          }
    }
  >
    <circle
      cx="12"
      cy="12"
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
    <svg
      width="24px"
      height="24px"
      style={{
        overflow: 'visible',
        cursor: 'pointer'
      }}
    >
      <circle
        cx="12"
        cy="12"
        r="12"
        fill={errorColor || graphErrorColor}
        onMouseOver={() => setShowErrors(activityId || true)}
        onMouseOut={() => setShowErrors(false)}
      />
      <circle
        cx="12"
        cy="12"
        r="12"
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
