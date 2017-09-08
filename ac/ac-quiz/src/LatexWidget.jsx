// @flow

import React from 'react';
import Latex from 'react-latex';

export default (props: Object) => {
  const { options, value, required, disabled, readonly, onChange } = props;
  // Generating a unique field name to identify this set of radio buttons
  const name = Math.random().toString();
  const { enumOptions, inline } = options;
  // checked={checked} has been moved above name={name}, As mentioned in #349;
  // this is a temporary fix for radio button rendering bug in React, facebook/react#7630.
  return (
    <div className="field-radio-group">
      {enumOptions.map(option => {
        const checked = option.value === value;
        const disabledCls = disabled || readonly ? 'disabled' : '';
        const radio = (
          <span>
            <input
              {...{ type: 'radio', checked, name, required }}
              value={option.value}
              disabled={disabled || readonly}
              onChange={() => onChange(option.value)}
            />
            <Latex>
              {option.label}
            </Latex>
          </span>
        );

        return inline
          ? <label key={option.label} className={`radio-inline ${disabledCls}`}>
              {radio}
            </label>
          : <div key={option.label} className={`radio ${disabledCls}`}>
              <label>
                {radio}
              </label>
            </div>;
      })}
    </div>
  );
};
