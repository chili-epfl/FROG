// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Check, Warning } from '@material-ui/icons';

const useStyle = makeStyles(() => ({
  root: {
    width: '32px',
    height: '32px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.8)'
  },
  dot: {
    width: '8px',
    height: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '12px',
    borderRadius: '50%',
    transition: '.2s all',

    '&.pending': {
      width: '8px',
      height: '8px',
      border: '4px solid #CCC'
    },

    '&.active': {
      width: '16px',
      height: '16px',
      border: '3px solid #31BFAE',
      animation: `$pulse 2500ms 200ms infinite`
    },

    '&.completed': {
      width: '16px',
      height: '16px',
      border: '8px solid #31BFAE'
    },

    '&.error': {
      width: '16px',
      height: '16px',
      border: '8px solid #FF0000'
    }
  },
  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)'
    },
    '50%': {
      transform: 'scale(1.2)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  }
}));

type ActivityStatusPropsT = {
  status: 'pending' | 'active' | 'completed' | 'error'
};

export const ActivityStatus = (props: ActivityStatusPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <div className={`${classes.dot} ${props.status}`}>
        {props.status === 'completed' && <Check fontSize="inherit" />}
        {props.status === 'error' && <Warning fontSize="inherit" />}
      </div>
    </div>
  );
};
