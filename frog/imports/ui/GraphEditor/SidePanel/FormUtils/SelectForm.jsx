// @flow

import React from 'react';
import FlexView from 'react-flexview';
import { FormGroup, FormControl } from 'react-bootstrap';
import { uniq, compact } from 'lodash';

import { connect } from '../../store';

export default connect(({ formContext, onChange, value = '', store }) => {
  const options = formContext.options.filter(
    x => x !== formContext.groupingKey
  );
  const storeOp = store.operatorStore.all.find(
    x => x.id === formContext.nodeId
  );
  const targetActivities = storeOp.outgoing.filter(x => x.klass === 'activity');
  const aTs = targetActivities.map(x => x.activityType);
  if (uniq(aTs).length > 1) {
    return (
      <span style={{ color: 'red' }}>
        Can only be connected to activities with the same activityType
      </span>
    );
  }
  if (uniq(compact(aTs)).length === 0) {
    return (
      <span style={{ color: 'red' }}>
        No connected activity, please connect to one
      </span>
    );
  }
  const aT = aTs[0];
  console.log(JSON.stringify({ targetActivities, aTs, aT }));
  return (
    <FormGroup controlId="selectGrouping">
      <FlexView>
        <FlexView vAlignContent="center">
          {options.length > 0 ? (
            <FormControl
              onChange={e => onChange(e.target.value)}
              componentClass="select"
              value={value}
            >
              {['', ...options].map(x => (
                <option value={x} key={x}>
                  {x === '' ? 'Choose an attribute' : x}
                </option>
              ))}
            </FormControl>
          ) : (
            <span style={{ color: 'red' }}>
              No attributes provided, add social operator
            </span>
          )}
          {value.length > 0 &&
          options.length > 0 &&
          !options.includes(value) ? (
            <p style={{ color: 'red' }}>
              You previously selected the <b>{value}</b> attribute, but no
              social operator is currently providing that attribute, please
              reconfigure the incoming social operators, or select another
              attribute
            </p>
          ) : null}
        </FlexView>
      </FlexView>
    </FormGroup>
  );
});
