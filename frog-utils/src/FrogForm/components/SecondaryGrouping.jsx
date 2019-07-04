// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import type { ObjectFieldTemplatePropsT } from '../types';

const generateStyles = makeStyles(theme => ({
  root: {
    display: 'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gridColumnGap: theme.spacing(3),
    paddingBottom: theme.spacing(1)
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1)
  },
  badge: {
    marginLeft: theme.spacing(1)
  },
  content: {
    gridColumnStart: 'span 8'
  },
  description: {
    color: theme.palette.grey[700],
    gridColumnStart: 'span 4',
    marginBottom: theme.spacing(1)
  }
}));

/**
 * Provides second-level navigation inside a Form element
 * @param {ObjectFieldTemplatePropsT} props
 */
export const SecondaryGrouping = (props: ObjectFieldTemplatePropsT) => {
  const classes = generateStyles();

  const title = props.title || props.uiSchema['ui:title'];
  const description = props.description;

  const { required, readonly, properties } = props;

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <div className={classes.header}>
          {title && <Typography variant="button">{title}</Typography>}
        </div>
        <div className={classes.fields}>
          {properties.map(props => props.content)}
        </div>
      </div>
      {description && (
        <Typography className={classes.description} variant="body2">
          {description}
        </Typography>
      )}
    </div>
  );
};
