// @flow

import * as React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    background: 'transparent',
    boxShadow: `1px solid ${theme.palette.grey[300]}`
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    flexGrow: 1
  }
}));

type TopBarPropsT = {
  leftIcon?: React.Node,
  onLeftButtonClick?: () => void,
  title?: string,
  rightButtons?: React.Node | React.Node[]
};

export const TopBar = (props: TopBarPropsT) => {
  const classes = useStyles();

  const { leftIcon, onLeftButtonClick, title, rightButtons } = props;

  return (
    <AppBar
      className={classes.root}
      position="static"
      color="inherit"
      elevation={0}
    >
      <Toolbar>
        {leftIcon !== undefined && (
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
            onClick={onLeftButtonClick}
          >
            {leftIcon}
          </IconButton>
        )}
        {title !== undefined && (
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
        )}
        {rightButtons}
      </Toolbar>
    </AppBar>
  );
};
