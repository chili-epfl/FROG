// @flow

import * as React from 'react';
import { makeStyles, Typography, IconButton } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import type { ObjectFieldTemplatePropsT } from '../types';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 3),
    borderBottom: `1px ${theme.palette.grey[300]} solid`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: theme.spacing(10)
  },
  badge: {
    marginLeft: theme.spacing(1)
  },
  description: {
    marginLeft: theme.spacing(2),
    color: theme.palette.grey[700],
    flexGrow: 1
  },
  expandIcon: {
    marginLeft: theme.spacing(2),
    transition: 'all .2s'
  },
  fields: {
    marginBottom: theme.spacing(3)
  }
}));

/**
 * Provides first-level navigation for a Form element
 * @param {ObjectFieldTemplatePropsT} props
 */
export const PrimaryGrouping = (props: ObjectFieldTemplatePropsT) => {
  const classes = useStyles();
  const [expand, setExpand] = React.useState(false);

  const title = props.title || props.uiSchema['ui:title'];
  const description = props.description;

  const { required, readonly, properties } = props;

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {title && <Typography variant="h6">{title}</Typography>}
        {description && (
          <Typography className={classes.description} variant="body2">
            {description}
          </Typography>
        )}
        <IconButton
          className={classes.expandIcon}
          style={{
            transform: expand ? 'rotate(180deg)' : undefined
          }}
          onClick={() => setExpand(!expand)}
        >
          <ExpandMore />
        </IconButton>
      </div>
      {expand && (
        <div className={classes.fields}>
          {properties.map(props => (
            <div>{props.content}</div>
          ))}
        </div>
      )}
    </div>
  );
};
