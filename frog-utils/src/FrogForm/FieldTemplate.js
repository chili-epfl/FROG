// @flow

import * as React from 'react';

import { Label } from './components/Label';
import type { FieldTemplatePropsT } from './types';

/**
 * Redefines the UI of fields, by changing the way labels are displayed
 */
export const FieldTemplate = (props: FieldTemplatePropsT) => {
  if (props.displayLabel) {
    return (
      <Label label={props.label} description={props.rawDescription}>
        {props.children}
      </Label>
    );
  } else {
    return <>{props.children}</>;
  }
};
