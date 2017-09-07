// @flow

import React from 'react';
import FlexView from 'react-flexview';
import { FormGroup, ControlLabel, FormControl } from 'react-bootstrap';

import { connect } from '../../store';

export default connect(({ activity, onChange, store: { valid } }) =>
  <FormGroup controlId="selectGrouping">
    <FlexView>
      <FlexView vAlignContent="center" marginRight="10px">
        <ControlLabel>Group by attribute</ControlLabel>
      </FlexView>
      <FlexView vAlignContent="center">
        {valid.social[activity._id]
          ? <FormControl
              onChange={e => onChange(e.target.value)}
              componentClass="select"
              value={activity.groupingKey}
            >
              {['', ...valid.social[activity._id]].map(x =>
                <option value={x} key={x}>
                  {x === '' ? 'Choose an attribute' : x}
                </option>
              )}
            </FormControl>
          : <span style={{ color: 'red' }}>
              No attributes provided, add social operator
            </span>}
        {typeof activity.groupingKey === 'string' &&
        activity.groupingKey.length > 0 &&
        valid.social[activity._id] &&
        !valid.social[activity._id].includes(activity.groupingKey)
          ? <p style={{ color: 'red' }}>
              You previously selected the <b>{activity.groupingKey}</b>{' '}
              attribute, but no social operator is currently providing that
              attribute, please reconfigure the incoming social operators, or
              select another attribute
            </p>
          : null}
      </FlexView>
    </FlexView>
  </FormGroup>
);
