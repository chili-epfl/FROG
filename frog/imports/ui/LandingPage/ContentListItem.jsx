// @flow
import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { MoreVert } from '@material-ui/icons';
import { OverflowMenu } from '../OverflowMenu';
import { RowButton } from '../RowItems';
import { Button } from '../Button';

type ContentListItemPropsT = {
  itemTitle: string,
  itemIcon: React.ComponentType<*>,
  status?: 'Ready' | 'Running' | 'Complete',
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
  overflowitems,
  callback
}: ContentListItemPropsT) => {
  const Icon = itemIcon;

  return (
    <ListItem divider button onClick={callback}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>
      <ListItemText primary={itemTitle} divider secondary={status} />

      <OverflowMenu button={<Button variant="minimal" icon={<MoreVert />} />}>
        {overflowitems.map((item, index) => {
          const ListIcon = item.icon;
          return (
            <RowButton key={index} icon={<ListIcon fontSize="small" />}>
              {' '}
              {item.title}{' '}
            </RowButton>
          );
        })}
      </OverflowMenu>
    </ListItem>
  );
};
