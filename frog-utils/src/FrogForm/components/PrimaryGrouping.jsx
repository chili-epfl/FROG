// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

import type { ObjectFieldTemplatePropsT } from '../types';

const useStyles = makeStyles(theme => ({
  root: {
    borderBottom: `1px ${theme.palette.grey[300]} solid`
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    height: theme.spacing(10),
    textAlign: 'left'
  },
  badge: {
    marginLeft: theme.spacing(1)
  },
  title: {
    lineHeight: 1,
  }
  description: {
    marginLeft: theme.spacing(2),
    color: theme.palette.grey[700],
    flexGrow: 1,
    lineHeight: 1,
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

  // State to control whether the group is expanded or not
  // We set it to true to show expanded by default
  const [expand, setExpand] = React.useState(true);

  const title = props.title;
  const description = props.description;

  const { properties } = props;

  return (
    <div className={classes.root}>
      <ButtonBase
        className={classes.header}
        elevation={0}
        onClick={() => setExpand(!expand)}
      >
        {title && <Typography className={classes.title} variant="h6">{title}</Typography>}
        {description && (
          <Typography className={classes.description} variant="body2">
            {description}
          </Typography>
        )}
        <ExpandMore
          className={classes.expandIcon}
          style={{
            transform: expand ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </ButtonBase>
      {expand && (
        <div className={classes.fields}>
          {properties.map(p => (
            <div>{p.content}</div>
          ))}
        </div>
      )}
    </div>
  );
};
