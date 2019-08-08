// @flow

import * as React from 'react';
import { makeStyles, ButtonBase } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0, 1),
    display: 'flex',
    justifyContent: 'center',
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
  }
}));

type MinimalIconButtonProps = {
  size?: 'large' | 'default',
  icon: React.Element<*>
};

export const MinimalIconButton = (props: MinimalIconButtonProps) => {
  const classes = useStyle();
  return (
    <ButtonBase
      className={classes.root}
      style={{
        width: props.size === 'large' ? '48px' : '32px',
        height: props.size === 'large' ? '48px' : '32px'
      }}
    >
      {props.icon}
    </ButtonBase>
  );
};
