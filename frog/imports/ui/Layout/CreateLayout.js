// @flow

import * as React from 'react';
import { makeStyles } from '@material-ui/core';

const useStyle = makeStyles(() => ({
  root: {
    width: '100%',
    background: 'white',

    display: 'flex',
    justifyContent: 'center'
  },
  content: {
    width: '100%',
    maxWidth: '960px'
  },
  header: {
    position: 'fixed',
    left: 0,
    right: 0
  }
}));

type SidebarLayoutPropsT = {
  header?: React.Element<*>,
  content?: React.Element<*>
};

/**
 * TopBar provides UI knobs to show navigation and important actions
 */
export const CreateLayout = (props: SidebarLayoutPropsT) => {
  const classes = useStyle();
  return (
    <div className={classes.root}>
      <header className={classes.header}>{props.header}</header>
      <div className={classes.content}>
        <>{props.content}</>
      </div>
    </div>
  );
};
