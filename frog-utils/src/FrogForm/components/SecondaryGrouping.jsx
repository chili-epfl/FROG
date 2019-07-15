// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import type { ObjectFieldTemplatePropsT } from '../types';

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(1)
  },
  titleAndDescription: {
    display: 'flex',
    marginBottom: theme.spacing(0.5)
  },
  title: {
    lineHeight: 0
  },
  description: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(2)
  }
}));

/**
 * Provides second-level navigation inside a Form element
 * @param {ObjectFieldTemplatePropsT} props
 */
export const SecondaryGrouping = (props: ObjectFieldTemplatePropsT) => {
  const classes = useStyles();

  const { properties } = props;

  return (
    <div className={classes.root}>
      <div className={classes.titleAndDescription}>
        <Typography className={classes.title} variant="button">
          {props.title}
        </Typography>
        {props.description && (
          <Typography className={classes.description} variant="body2">
            {props.description}
          </Typography>
        )}
      </div>
      <div className={classes.fields}>
        {properties.map(p => (
          <div>{p.content}</div>
        ))}
      </div>
    </div>
  );
};
