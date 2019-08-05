import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OverflowPanel from '../components/OverflowPanel';

export const ContentListItem = ({
  itemTitle,
  itemIcon,
  status,
  overflowitems
}) => {
  const Icon = itemIcon;

  return (
    <ListItem divider>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={itemTitle} divider secondary={status} />

      <OverflowPanel overflowElements={overflowitems} />
    </ListItem>
  );
};
