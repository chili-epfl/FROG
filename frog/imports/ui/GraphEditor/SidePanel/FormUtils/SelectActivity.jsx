// @flow

import React from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from '../../store';

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

export const SelectAnyActivityWidget = connect(
  ({ formContext, store, ...rest }: any) => {
    const choices = store.activityStore.all;
    return (
      <SelectActivityWidget
        choices={choices}
        emptyErr="No other activities in the graph, please add an activity"
        {...rest}
      />
    );
  }
);

export const SelectSourceActivityWidget = connect(
  ({ formContext, store, ...rest }: any) => {
    const sourceIds = store.connectionStore.all
      .filter(x => x.target.id === formContext.nodeId)
      .map(x => x.source.id);
    const choices = store.activityStore.all.filter(x =>
      sourceIds.includes(x.id)
    );
    return (
      <SelectActivityWidget
        choices={choices}
        emptyErr="No activities tconnected, please connect an activity"
        {...rest}
      />
    );
  }
);

export const SelectTargetActivityWidget = connect(
  ({ formContext, store, ...rest }: any) => {
    const targetIds = store.connectionStore.all
      .filter(x => x.source.id === formContext.nodeId)
      .map(x => x.target.id);
    const choices = store.activityStore.all.filter(x =>
      targetIds.includes(x.id)
    );
    return (
      <SelectActivityWidget
        choices={choices}
        emptyErr="Not connected to any activities, please connect to an activity"
        {...rest}
      />
    );
  }
);
