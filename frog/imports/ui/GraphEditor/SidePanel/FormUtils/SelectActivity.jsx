// @flow

import React from 'react';
import { FormControl } from 'react-bootstrap';

const SelectActivityWidget = ({
  choices,
  onChange,
  value = '',
  emptyErr
}: any) => (
  <span>
    {choices && choices.length > 0 ? (
      <FormControl
        onChange={e => onChange(e.target.value)}
        componentClass="select"
        value={value}
      >
        {['', ...choices].map(x => (
          <option value={x.id || ''} key={x.id || 'choose'}>
            {x === '' ? 'Choose an activity' : x.title}
          </option>
        ))}
      </FormControl>
    ) : (
      <span style={{ color: 'red' }}>{emptyErr}</span>
    )}
  </span>
);

export const SelectAnyActivityWidget = ({ formContext, ...rest }: any) => (
  <SelectActivityWidget
    choices={formContext.connectedActivities}
    emptyErr="No other activities in the graph, please add an activity"
    {...rest}
  />
);

export const SelectSourceActivityWidget = ({ formContext, ...rest }: any) => (
  <SelectActivityWidget
    choices={formContext.connectedSourceActivities}
    emptyErr="No activities connected, please connect an activity"
    {...rest}
  />
);

export const SelectTargetActivityWidget = ({ formContext, ...rest }: any) => (
  <SelectActivityWidget
    choices={formContext.connectedTargetActivities}
    emptyErr="Not connected to any activities, please connect to an activity"
    {...rest}
  />
);
