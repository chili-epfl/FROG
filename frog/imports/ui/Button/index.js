// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 1, 0, 0),

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start',

    borderRadius: theme.shape.borderRadius,

    color: '#333',
    overflow: 'hidden',

    '&.variant-default': {
      border: '1px solid #EAEAEA'
    },
    '&.variant-minimal': {},
    '&.variant-primary': {
      color: 'white',
      background: '#31BFAE'
    },

    '&.size-default': {
      height: '32px'
    },
    '&.size-large': {
      height: '48px'
    },

    '&.disabled': {
      opacity: 0.5
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1)
  },
  rightIcon: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: theme.spacing(1)
  },
  text: {
    fontSize: '14px',
    lineHeight: 1,
    marginLeft: theme.spacing(1)
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
  }
}));

type ButtonProps = {
  disabled?: boolean,
  variant?: 'default' | 'minimal' | 'primary',
  size?: 'default' | 'large',
  icon?: React.Element<*>,
  rightIcon?: React.Element<*>,
  text?: string,
  onClick?: (e: Event) => void,
  children?: string
};

export const Button = (props: ButtonProps) => {
  const classes = useStyle();

  const { variant, size, disabled } = props;

  return (
    <ButtonBase
      className={`
        ${classes.root} 
        variant-${variant || 'default'} 
        size-${size || 'default'}
        ${disabled ? 'disabled' : 'active'}
      `}
      disabled={disabled}
      onClick={props.onClick}
    >
      {props.icon && <div className={classes.icon}>{props.icon}</div>}
      {props.children && (
        <Typography className={classes.text} variant="body1">
          {props.children}
        </Typography>
      )}
      {props.rightIcon && (
        <div className={classes.rightIcon}>{props.rightIcon}</div>
      )}
      <span className={classes.hover} />
    </ButtonBase>
  );
};
