// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    padding: theme.spacing(0, 2),

    '&.size-default': {
      height: '48px'
    },
    '&.size-large': {
      height: '64px'
    },
    '&.size-xLarge': {
      height: '96px'
    },

    '&.color-white': {
      background: 'white'
    },
    '&.color-transparent': {
      background: 'transparent'
    }
  },
  navigation: {
    height: '100%',
    display: 'flex',
    alignItems: 'center'
  },
  actions: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto'
  }
}));

type TopBarPropsT = {
  navigation?: React.Element<*>,
  actions?: React.Element<*>,
  size?: 'default' | 'large' | 'xLarge',
  variant?: 'minimal' | 'default',
  color?: 'white' | 'transparent'
};

/**
 * TopBar provides UI knobs to show navigation and important actions
 */
export const TopBar = (props: TopBarPropsT) => {
  const classes = useStyle();
  return (
    <div
      className={`${classes.root} size-${props.size ||
        'default'} color-${props.color || 'white'}`}
      style={{
        borderBottom:
          props.variant === 'minimal' ? undefined : '1px solid #EAEAEA'
      }}
    >
      <div className={classes.navigation}>{props.navigation}</div>
      <div className={classes.actions}>{props.actions}</div>
    </div>
  );
};
