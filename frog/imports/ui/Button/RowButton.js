// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    width: '100%',
    padding: theme.spacing(0, 2),
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start'
  },
  hover: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    transition: '.2s all',
    opacity: 0,
    background: 'currentColor',

    '&:hover': {
      opacity: 0.1
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  text: {
    fontSize: '14px',
    lineHeight: 1
  }
}));

type RowButtonProps = {
  variant?: 'primary' | 'default',
  size?: 'large' | 'default',
  icon?: React.Element<*>,
  text: string
};

export const RowButton = (props: RowButtonProps) => {
  const classes = useStyle();
  return (
    <ButtonBase
      className={classes.root}
      style={{
        height: props.size === 'large' ? '48px' : '32px',
        color: props.variant === 'primary' ? 'white' : '#333',
        background: props.variant === 'primary' ? '#31BFAE' : 'white'
      }}
    >
      {props.icon && <div className={classes.icon}>{props.icon}</div>}
      <Typography className={classes.text} variant="body1">
        {props.text}
      </Typography>
      <span className={classes.hover} />
    </ButtonBase>
  );
};
