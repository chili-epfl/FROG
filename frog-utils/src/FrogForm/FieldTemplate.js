// @flow

import * as React from 'react';

import { Typography, makeStyles } from '@material-ui/core';
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

export const FieldTemplate = (props: FieldTemplatePropsT) => {
  const classes = useStyles();

  if (props.displayLabel) {
    return (
      <div className={classes.root}>
        <div className={classes.titleAndDescription}>
          <Typography className={classes.title} variant="body2">
            {props.label}
          </Typography>
          {props.rawDescription && (
            <Typography className={classes.description} variant="body2">
              {props.rawDescription}
            </Typography>
          )}
        </div>
        {props.children}
      </div>
    );
  } else {
    return <>{props.children}</>;
  }
};
