// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    width: '100%',
    padding: theme.spacing(0, 2, 0, 0),

    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textAlign: 'start',

    color: '#333',
    overflow: 'hidden',

    '&.active': {
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
    width: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'all',
    marginLeft: theme.spacing(2)
  },
  rightIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    userSelect: 'all',
    marginLeft: theme.spacing(2)
  },
  text: {
    fontSize: '14px',
    marginLeft: theme.spacing(2),
    flexGrow: 1,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
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

type RowButtonProps = {
  disabled?: boolean,
  active?: boolean,
  size?: 'default' | 'large',
  icon?: React.Element<*>,
  rightIcon?: React.Element<*>,
  onClick?: (e: Event) => void,
  children: string
};

export const RowButton = (props: RowButtonProps) => {
  const classes = useStyle();

  const { active, size, disabled } = props;

  return (
    <ButtonBase
      className={`
        ${classes.root} 
        size-${size || 'default'}
        ${disabled ? 'disabled' : ''}
        ${active ? 'active' : ''}
      `}
      active={active}
      disabled={disabled}
      onClick={props.onClick}
    >
      <span className={classes.hover} />
      <div className={classes.icon}>{props.icon}</div>
      <Typography className={classes.text} variant="body1">
        {props.children}
      </Typography>
      {props.rightIcon && (
        <div
          className={classes.rightIcon}
          onMouseDown={e => {
            e.stopPropagation();
          }}
        >
          {props.rightIcon}
        </div>
      )}
    </ButtonBase>
  );
};
