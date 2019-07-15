// @flow

import * as React from 'react';

import { Typography, makeStyles } from '@material-ui/core';

import { Label } from './components/Label';
import type { FieldTemplatePropsT } from './types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0)
  },
  titleAndDescription: {
    display: 'flex',
    marginBottom: theme.spacing(0.5)
  },
  title: {
    fontWeight: 700
  },
  description: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(2)
  }
}));

/**
 * Redefines the UI of fields, by changing the way labels are displayed
 */
export const FieldTemplate = (props: FieldTemplatePropsT) => {
  const classes = useStyles();

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
