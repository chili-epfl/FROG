// @flow

import * as React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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
    lineHeight: 1
  },
  description: {
    color: theme.palette.grey[700],
    paddingLeft: theme.spacing(2),
    lineHeight: 1
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
        {properties.map((p, i) => (
          <div key={i}>{p.content}</div>
        ))}
      </div>
    </div>
  );
};
