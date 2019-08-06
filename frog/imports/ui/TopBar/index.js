// @flow

import * as React from 'react';
import { AppBar, makeStyles } from '@material-ui/core';

import { Breadcrumb } from './Breadcrumb';
import { ActionMenu } from './ActionMenu';
import { PlayArrow } from '@material-ui/icons';
import type { TopBarViewT, TopBarActionT } from './types';

const useStyle = makeStyles(theme => ({
  appBarRoot: {
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'row nowrap',
    padding: theme.spacing(0, 1),
    background: 'white'
  },

  actions: {
    marginLeft: 'auto'
  }
}));

type TopBarPropsT = {
  icon?: React.Element<*>,
  paths: string[],
  /**
   * These actions are displayed inside the TopBar itself. We
   * recommend not including more than 3 primary actions.
   */
  primaryActions?: TopBarActionT[],
  /**
   * These actions are displayed inside an overflow panel.
   */
  secondaryActions?: TopBarActionT[]
};

/**
 * TopBar provides UI knobs to show navigation and important actions
 */
export const TopBar = (props: TopBarPropsT) => {
  const classes = useStyle();
  return (
    <AppBar
      classes={{ root: classes.appBarRoot }}
      color="default"
      elevation={0}
      position="static"
    >
      <Breadcrumb icon={props.icon} paths={props.paths} />
      <div className={classes.actions}>
        {(props.primaryActions || props.secondaryActions) && (
          <ActionMenu
            primaryActions={props.primaryActions}
            secondaryActions={props.secondaryActions}
          />
        )}
      </div>
    </AppBar>
  );
};
