// @flow

import * as React from 'react';
import { Popover } from '@material-ui/core';

type OverflowMenuPropsT = {
  button: React.Element<*>,
  children: React.ChildrenArray<boolean | React.Element<*>>
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
          vertical: -4,
          horizontal: 'left'
        }}
      >
        <div style={{ width: '250px' }} onClick={handleClose}>
          {props.children}
        </div>
      </Popover>
    </>
  );
};
