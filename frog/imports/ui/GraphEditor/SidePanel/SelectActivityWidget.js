// @flow
import React from 'react';
import FlexView from 'react-flexview';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

export const SelectActivityWidget = ({
  formContext,
  onChange,
  value = ''
}: any) => {
  const options = formContext.connectedActivities;
  return (
    <span>
      {options.length > 0
        ? <FormControl
            onChange={e => onChange(e.target.value)}
            componentClass="select"
            value={value}
          >
            {['', ...options].map(x =>
              <option value={x.id} key={x.id || 'choose'}>
                {x === '' ? 'Choose an activity' : x.title}
              </option>
            )}
          </FormControl>
        : <span style={{ color: 'red' }}>
            No activities connected, please connect to an activity
          </span>}
    </span>
  );
};
