// @flow

import * as React from 'react';
import { Typography, makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    color: '#333',
    overflow: 'hidden',

    '& *': {
      marginRight: theme.spacing(1)
    },
    '& *:last-child': {
      marginRight: 0
    }
  },
  icon: {
    width: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing(2)
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
      {props.icon && <div className={classes.icon}>{props.icon}</div>}
      {props.paths.map((path, index) => (
        <React.Fragment key={path + '/' + index}>
          {index !== 0 && (
            <Typography className={classes.text} variant="body1">
              /
            </Typography>
          )}
          <Typography className={classes.text} variant="body1">
            {path}
          </Typography>
        </React.Fragment>
      ))}
    </div>
  );
};
