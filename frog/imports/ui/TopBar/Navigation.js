// @flow

import React from 'react';
import { Tabs, Tab, Tooltip, makeStyles } from '@material-ui/core';

import type { TopBarViewT } from './types';

const useStyle = makeStyles(theme => ({
  tab: {
    // the default value is too large for our use-case
    minWidth: 0
  }
}));

type NavigationPropsT = {
  currentView: number,
  views: TopBarViewT[],
  onChange?: (index: number) => void
};

/**
 * Displays a series of tabs used for navigation inside a TopBar element
 */
export const Navigation = (props: NavigationPropsT) => {
  const classes = useStyle();

  return (
    <Tabs
      value={props.currentView}
      indicatorColor="primary"
      textColor="primary"
      onChange={(_, value) => {
        if (props.onChange) props.onChange(value);
      }}
    >
      {props.views.map(item =>
        item.icon ? (
          <Tooltip key={item.id} title={item.title}>
            <Tab className={classes.tab} icon={item.icon} />
          </Tooltip>
        ) : (
          <Tab key={item.id} className={classes.tab} title={item.title} />
        )
      )}
    </Tabs>
  );
};
