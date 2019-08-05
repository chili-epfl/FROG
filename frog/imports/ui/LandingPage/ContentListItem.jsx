// @flow
import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import OverflowPanel from '../components/OverflowPanel';

type ContentListItemPropsT = {
  itemTitle: string,
  itemIcon: React.ComponentType<*>,
  status: 'Ready' | 'Running' | 'Complete',
  overflowitems: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};
export const ContentListItem = ({
  itemTitle,
  itemIcon,
  status,
  overflowitems
}: ContentListItemPropsT) => {
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
