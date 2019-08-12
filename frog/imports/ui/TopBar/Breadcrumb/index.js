// @flow

import * as React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: '#333',

    '& *': {
      marginRight: theme.spacing(1)
    },
    '& *:last-child': {
      marginRight: 0
    }
  },
  text: {
    fontSize: '14px'
  }
}));

type BreadcrumbProps = {
  icon?: React.Element<*>,
  paths: string[]
};

export const Breadcrumb = (props: BreadcrumbProps) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      {props.icon &&
        React.cloneElement(props.icon, {
          style: {
            width: '16px',
            height: '16px'
          }
        })}
      {props.paths.map((path, index) => (
        <>
          {index !== 0 && (
            <Typography className={classes.text} variant="body1">
              /
            </Typography>
          )}
          <Typography className={classes.text} variant="body1">
            {path}
          </Typography>
        </>
      ))}
    </div>
  );
};