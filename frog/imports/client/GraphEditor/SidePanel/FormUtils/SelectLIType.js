// @flow

import React from 'react';
import { values } from 'lodash';
import { FormControl } from 'react-bootstrap';
import { learningItemTypesObj } from '/imports/activityTypes';

export const SelectLITypeWidget = ({ onChange, value = '', editor }: any) => (
  <span>
    <FormControl
      onChange={e => onChange(e.target.value)}
      componentClass="select"
      value={value}
    >
      <option value="" key="choose">
        Choose a Learning Item Type
      </option>
      {values(learningItemTypesObj)
        .filter(x => (x.Creator || x.Editor) && (!editor || x.dataStructure))
        .map(li => (
          <option value={li.id} key={li.id}>
            {li.name}
          </option>
        ))}
    </FormControl>
  </span>
);

export const SelectLITypeEditorWidget = (props: *) => (
  <SelectLITypeWidget {...props} editor />
);
