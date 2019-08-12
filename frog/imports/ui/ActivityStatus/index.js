// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';
import { Check, Warning } from '@material-ui/icons';

const useStyle = makeStyles(() => ({
  root: {
    width: '8px',
    height: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: '12px',
    borderRadius: '50%',
    boxShadow: '0 0 0 10px rgba(255,255,255,0.9)',
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
      animation: `$pulse 2500ms 500ms infinite`
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
      transform: 'scale(0.5)'
    },
    '100%': {
      transform: 'scale(1)'
    }
  }
}));

export type ActivityStatusT = 'pending' | 'active' | 'completed' | 'error';

export type ActivityStatusPropsT = {
  status: ActivityStatusT
};

export const ActivityStatus = (props: ActivityStatusPropsT) => {
  const classes = useStyle();
  return (
    <div className={`${classes.root} ${props.status}`}>
      {props.status === 'completed' && <Check fontSize="inherit" />}
      {props.status === 'error' && <Warning fontSize="inherit" />}
    </div>
  );
};
