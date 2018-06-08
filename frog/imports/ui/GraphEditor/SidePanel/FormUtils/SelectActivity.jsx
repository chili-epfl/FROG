// @flow

import React from 'react';
import { FormControl } from 'react-bootstrap';
import { connect } from '../../store';

const SelectActivityWidget = connect(
  ({ choicetype, onChange, value = '', emptyErr, store, formContext }: any) => {
    let choices;

    if (formContext.connectedActivities) {
      choices = formContext.connectedActivities;
    } else {
      const node = (formContext.type === 'activity'
        ? store.activityStore
        : store.operatorStore
      ).all.find(x => x.id === formContext.nodeId);

      const outgoing =
        (node.outgoing && node.outgoing.filter(x => x.klass === 'activity')) ||
        [];
      const incoming =
        (node.incoming && node.incoming.filter(x => x.klass === 'activity')) ||
        [];
      const all = [...incoming, ...outgoing];
      console.log(JSON.stringify({ outgoing, incoming, all, node }));
      choices = { outgoing, incoming, all }[choicetype];
    }
    return (
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
  }
);

export const SelectAnyActivityWidget = (props: any) => (
  <SelectActivityWidget
    {...props}
    choicetype="all"
    emptyErr="No other activities in the graph, please add an activity"
  />
);

export const SelectSourceActivityWidget = (props: any) => (
  <SelectActivityWidget
    {...props}
    choicetype="incoming"
    emptyErr="No activities connected, please connect an activity"
  />
);

export const SelectTargetActivityWidget = (props: any) => (
  <SelectActivityWidget
    {...props}
    choicetype="outgoing"
    emptyErr="Not connected to any activities, please connect to an activity"
  />
);
