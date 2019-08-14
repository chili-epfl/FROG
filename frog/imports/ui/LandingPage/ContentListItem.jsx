// @flow
import * as React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { MoreVert } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { ListItemSecondaryAction } from '@material-ui/core';
import { OverflowMenu } from '../OverflowMenu';
import { RowButton } from '../RowItems';
import { Button } from '../Button';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  items: {
    margin: theme.spacing(1, 1, 1, 1)
  },
  status: {
    margin: theme.spacing(2, 2, 2, 2)
  }
}));

type ContentListItemPropsT = {
  itemTitle: string,
  itemIcon: React.ComponentType<*>,
  itemType: string,
  dateCreated: string,
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
  itemType,
  dateCreated,
  status,
  overflowitems,
  callback
}: ContentListItemPropsT) => {
  const Icon = itemIcon;
  const classes = useStyles();

  return (
    <ListItem alignItems="flex-start" divider button onClick={callback}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>

      <ListItemText
        primary={itemTitle}
        secondary={status ? status + '   |    ' + itemType : itemType}
        divider
      />

      <Typography
        className={classes.items}
        color="textSecondary"
        variant="body2"
      >
        {dateCreated}
      </Typography>
      <ListItemSecondaryAction>
        <OverflowMenu button={<Button variant="minimal" icon={<MoreVert />} />}>
          {overflowitems.map((item, index) => {
            const ListIcon = item.icon;
            return (
              <RowButton key={index} icon={<ListIcon fontSize="small" />}>
                {item.title}
              </RowButton>
            );
          })}
        </OverflowMenu>
      </ListItemSecondaryAction>
    </ListItem>
  );
};
