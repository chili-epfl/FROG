// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

import { Label } from './components/Label';
import type { FieldTemplatePropsT } from './types';

const useStyle = makeStyles(() => ({
  '@global': {
    '.field-array legend': {
      fontSize: '1.2em !important',
      fontWeight: 700
    }
  }
}));

/**
 * Redefines the UI of fields, by changing the way labels are displayed
 */
export const FieldTemplate = (props: FieldTemplatePropsT) => {
  useStyle();
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
