// @flow

import * as React from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Settings from '@material-ui/icons/Settings';

type OverflowPanelPropsT = {
  overflowElements: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};

type OverflowPanelStateT = {
  anchorEl: HTMLElement | null
};

export default class OverflowPanel extends React.Component<
  OverflowPanelPropsT,
  OverflowPanelStateT
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
    const { overflowElements } = this.props;
    const { anchorEl } = this.state;

    return (
      <React.Fragment>
        <IconButton
          data-testid="secondary-menu-button"
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
          {overflowElements.map((item, index) => {
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
      </React.Fragment>
    );
  }
}
