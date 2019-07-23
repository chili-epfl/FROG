// @flow

import * as React from 'react';
import {
  IconButton,
  makeStyles,
  Button,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon
} from '@material-ui/core';
import { MoreVert } from '@material-ui/icons';

import type { TopBarActionT } from './types';

const useStyle = makeStyles(theme => ({
  root: {
    display: 'flex'
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
        props.primaryActions.map(action =>
          action.icon ? (
            <Tooltip key={action.id} title={action.title}>
              <IconButton onClick={action.callback}>{action.icon}</IconButton>
            </Tooltip>
          ) : (
            <Button key={action.id} onClick={action.callback}>
              {action.title}
            </Button>
          )
        )}
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
