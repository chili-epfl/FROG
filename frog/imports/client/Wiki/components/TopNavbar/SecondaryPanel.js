//@flow

/***
 * This file defines the secondary panel of the Navbar. This component takes
 * the form of an overflow dropdown.
 */

import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Settings from '@material-ui/icons/Settings';

type SecondaryPanelPropsT = {
  /** List of buttons to display in the secondary view (dropdown)*/
  secondaryNavItems: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};

type SecondaryPanelStateT = {
  anchorEl: HTMLElement | null
};

export default class SettingsMenu extends React.Component<
  SecondaryPanelPropsT,
  SecondaryPanelStateT
> {
  state = {
    anchorEl: null
  };

  handleClick = (event: SyntheticMouseEvent<HTMLElement>) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  render() {
    const { secondaryNavItems } = this.props;
    const { anchorEl } = this.state;

    return (
      <div>
        <IconButton
          aria-owns={anchorEl ? 'overflow-menu' : null}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          <Settings />
        </IconButton>
        <Menu
          id="overflow-menu"
          anchorEl={anchorEl}
          open={anchorEl !== null}
          onClose={this.handleClose}
        >
          {secondaryNavItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <MenuItem
                key={index}
                onClick={() => {
                  if (item.callback !== undefined) {
                    item.callback();
                  }
                  this.handleClose();
                }}
              >
                <ListItemIcon>
                  <Icon />
                </ListItemIcon>
                {item.title}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }
}
