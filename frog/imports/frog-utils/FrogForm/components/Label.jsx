// @flow

import * as React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1, 0)
  },
  titleAndDescription: {
    display: 'flex',
    marginBottom: theme.spacing(0.5)
  },
  title: {
    fontWeight: 700,
    lineHeight: 1
  },
  description: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(2),
    lineHeight: 1
  }
}));

type LabelledFieldPropsT = {
  label: string,
  description?: string,
  children: React.Node | React.Node[]
};

/**
 * Defines a labelled field, optionally showing a description if it is present
 */
export const Label = (props: LabelledFieldPropsT) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.titleAndDescription}>
        <Typography className={classes.title} variant="body2">
          {props.label}
        </Typography>
        {props.description && (
          <Typography className={classes.description} variant="body2">
            {props.description}
          </Typography>
        )}
      </div>
      {props.children}
    </div>
  );
};
