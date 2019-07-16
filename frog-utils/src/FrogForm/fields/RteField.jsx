// @flow

import * as React from 'react';
import Fields from 'react-jsonschema-form-extras';

import { Label } from '../components/Label';
import type { CustomFieldPropsT } from '../types';

export const RteField = (props: CustomFieldPropsT) => {
  // Hack - RteField has the poor habit to show its own label.
  // We modify its prop so that it has nothing to show as a label.
  return (
    <Label
      label={props.schema.title || ''}
      description={props.schema.description}
    >
      <Fields.rte
        {...props}
        name={undefined}
        uiSchema={{ ...props.uiSchema, 'ui:title': undefined }}
        schema={{ ...props.schema, title: undefined }}
      />
    </Label>
  );
};
