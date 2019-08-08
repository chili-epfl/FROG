// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 1),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start',
    transition: '.2s all',
    borderRadius: theme.shape.borderRadius,

    '&:hover': {
      background: 'rgba(0,0,0,0.1)'
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(1)
  },
  text: {
    fontSize: '14px',
    color: '#333',
    lineHeight: 1
  }
}));

type MinimalButtonProps = {
  size?: 'large' | 'default',
  icon?: React.Element<*>,
  text: string
};

export const MinimalButton = (props: MinimalButtonProps) => {
  const classes = useStyle();
  return (
    <ButtonBase
      className={classes.root}
      style={{ height: props.size === 'large' ? '48px' : '32px' }}
    >
      {props.icon && <div className={classes.icon}>{props.icon}</div>}
      <Typography className={classes.text} variant="body1">
        {props.text}
      </Typography>
    </ButtonBase>
  );
};
