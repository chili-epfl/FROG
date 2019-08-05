// @flow

import * as React from 'react';
import {
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  ListItemIcon
} from '@material-ui/core';

const useStyle = makeStyles(theme => ({
  root: {
    height: '32px',
    padding: theme.spacing(0, 1),
    '&:hover': {
      background: '#EAEAEA'
    }
  },
  text: {
    fontSize: '14px'
  },
  icon: {
    minWidth: 'initial',
    marginRight: theme.spacing(1)
  }
}));

type SidebarListItemProps = {
  title: string,
  icon?: React.Node,
  selected?: boolean
};

export const SidebarListItem = (props: SidebarListItemProps) => {
  const classes = useStyle();
  return (
    <ListItem
      className={classes.root}
      style={props.selected ? { color: 'white', background: '#88AAEE' } : {}}
      button
    >
      {props.icon && (
        <ListItemIcon className={classes.icon}>{props.icon}</ListItemIcon>
      )}
      <ListItemText disableTypography>
        <Typography className={classes.text}>{props.title}</Typography>
      </ListItemText>
    </ListItem>
  );
};
