// @flow

import * as React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import grey from '@material-ui/core/colors/grey';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(1),
    color: grey[700],
    transition: '.2s all',
    cursor: 'pointer',
    '&:hover': {
      background: 'rgba(0,0,0,0.1)'
    }
  }
}));

type HeaderPropsT = {
  title: string,
  subtitle: string,
  onClick?: () => {}
};

/**
 * Displays a title and subtitle. Used with the sidebar component.
 */
export const Header = (props: HeaderPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root} onClick={props.onClick}>
      <Typography variant="subtitle1">{props.title}</Typography>
      <Typography variant="body2">{props.subtitle}</Typography>
    </div>
  );
};
