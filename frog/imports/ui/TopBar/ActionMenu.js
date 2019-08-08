// @flow

import * as React from 'react';
import {
  IconButton,
  makeStyles,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';
import { MinimalButton } from '../Button';

import type { TopBarActionT } from './types';

const useStyle = makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  }
}));

type ActionMenuPropsT = {
  primaryActions?: TopBarActionT[],
  secondaryActions?: TopBarActionT[]
};

/**
 * Displays an action menu with an overflow panel inside a TopBar element
 */
export const ActionMenu = (props: ActionMenuPropsT) => {
  const classes = useStyle();
  const [anchorEl, setAnchorEl] = React.useState(null);

  return (
    <div className={classes.root}>
      {props.primaryActions &&
        props.primaryActions.map(action => (
          <MinimalButton text={action.title || ''} icon={action.icon} />
        ))}
      {props.secondaryActions && (
        <>
          <IconButton onClick={event => setAnchorEl(event.currentTarget)}>
            <MoreVert />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            {props.secondaryActions.map(action => (
              <MenuItem
                key={action.id}
                onClick={() => {
                  if (action.callback) action.callback();
                  setAnchorEl(null);
                }}
              >
                {action.icon && <ListItemIcon>{action.icon}</ListItemIcon>}
                {action.title}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </div>
  );
};
