// @flow

import * as React from 'react';
import { makeStyles, Typography, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexFlow: 'column nowrap',

    borderRadius: theme.shape.borderRadius,
    color: '#333',
    overflow: 'hidden',
    border: '1px solid #EAEAEA',

    '&.disabled': {
      opacity: 0.5
    }
  },
  text: {
    width: '100%',
    textAlign: 'center',
    padding: theme.spacing(1)
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

type PictureButtonProps = {
  disabled?: boolean,
  text?: string,
  onClick?: (e: Event) => void,
  children?: React.Element<*>
};

export const PictureButton = (props: PictureButtonProps) => {
  const classes = useStyle();

  const { disabled } = props;

  return (
    <ButtonBase
      className={`
        ${classes.root} 
        ${disabled ? 'disabled' : 'active'}
      `}
      disabled={disabled}
      onClick={props.onClick}
    >
      <span className={classes.hover} />
      {props.children}
      <div className={classes.text}>
        <Typography>{props.text}</Typography>
      </div>
    </ButtonBase>
  );
};
