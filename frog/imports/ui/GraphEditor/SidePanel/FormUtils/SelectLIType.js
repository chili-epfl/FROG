// @flow

import React from 'react';
import { values } from 'lodash';
import { FormControl } from 'react-bootstrap';
import { learningItemTypesObj } from '/imports/activityTypes';

const SelectLIType = ({ onChange, value = '' }: any) => (
  <span>
    <FormControl
      onChange={e => onChange(e.target.value)}
      componentClass="select"
      value={value}
    >
      <option value="" key="Choose">
        'Choose a Learning Item Type'
      </option>
      <>
        {values(learningItemTypesObj)
          .filter(x => x.Creator || x.Editor)
          .map(x => (
            <option value={x.id || ''} key={x.id || 'choose'}>
              {x === '' ? 'Choose a Learning Item Type' : x.name}
            </option>
          ))}
      </>
    </FormControl>
  </span>
);

export default SelectLIType;
