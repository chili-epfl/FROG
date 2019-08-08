// @flow

import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import { MoreVert } from '@material-ui/icons';
import { Popover, Paper } from '@material-ui/core';

type OverflowMenuPropsT = {
  button: React.Element<*>,
  children: React.Element<*>[]
};

type OverflowPanelStateT = HTMLElement | null;

export const OverflowMenu = (props: OverflowMenuPropsT) => {
  const [anchorEl, setAnchorEl] = React.useState<OverflowPanelStateT>(null);

  const handleClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div onClick={handleClick}>{props.button}</div>
      <Popover
        id="overflow-menu"
        anchorEl={anchorEl}
        open={anchorEl !== null}
        onClose={handleClose}
        anchorReference="anchorEl"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <div style={{ width: '200px', padding: '8px 0' }} onClick={handleClose}>
          {props.children}
        </div>
      </Popover>
    </>
  );
};
