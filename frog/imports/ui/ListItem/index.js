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
import ArchiveIcon from '@material-ui/icons/Archive';

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
  itemTitle?: string,
  itemIcon: React.ComponentType<*>,
  status?: 'Ready' | 'Running' | 'Complete',
  itemType?: string,
  dateCreated: string,
  callback: () => void,
  secondaryActions?: Array<{
    title: string,
    icon: React.ComponentType<*>,
    callback?: () => void
  }>
};
export const ContentListItem = ({
  itemTitle,
  itemIcon,
  status,
  itemType,
  dateCreated,
  callback,
  secondaryActions
}: ContentListItemPropsT) => {
  const Icon = itemIcon || 'div';
  const classes = useStyles();
  const secondaryText = status ? `${status} | ${itemType}` : itemType || ' ';

  const DateToMoments = moment => {
    try {
      const dateThen = moment.split(' ')[1];
      const timeThen = moment.split(' ')[0];
      const dateThenSplit = dateThen.split('/');
      const timeThenSplit = timeThen.split(':');
      const date = new Date();
      const dateNow = date.toLocaleDateString();
      const timeNowSplit = [
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      ];
      const dateNowSplit = dateNow.split('/');
      const diffYear =
        parseInt(dateNowSplit[2], 10) - parseInt(dateThenSplit[2], 10);
      const diffMonth =
        parseInt(dateNowSplit[1], 10) - parseInt(dateThenSplit[1], 10);
      const diffDate =
        parseInt(dateNowSplit[0], 10) - parseInt(dateThenSplit[0], 10);
      const diffHours =
        parseInt(timeNowSplit[0], 10) - parseInt(timeThenSplit[0], 10);
      const diffMinutes =
        parseInt(timeNowSplit[1], 10) - parseInt(timeThenSplit[1], 10);
      // const diffSeconds =
      //   parseInt(timeNowSplit[2], 10) - parseInt(timeThenSplit[2], 10);
      if (diffYear > 0) {
        return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
      } else if (diffMonth > 0) {
        return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
      } else if (diffDate > 0) {
        return `${diffDate} day${diffDate > 1 ? 's' : ''} ago`;
      } else if (diffHours > 0) {
        return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
      } else {
        return `a few seconds ago`;
      }
    } catch (err) {
      return moment;
    }
  };

  return (
    <ListItem alignItems="flex-start" divider button onClick={callback}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>

      <ListItemText primary={itemTitle} secondary={secondaryText} />

      <Typography
        className={classes.items}
        color="textSecondary"
        variant="body2"
      >
        {DateToMoments(dateCreated)}
      </Typography>
      {secondaryActions && (
        <ListItemSecondaryAction>
          <OverflowMenu
            button={<Button variant="minimal" icon={<MoreVert />} />}
          >
            {secondaryActions.map((item, index) => {
              const ListIcon = item.icon;
              return (
                <RowButton
                  key={index}
                  icon={<ListIcon />}
                  onClick={item.action}
                >
                  {item.title}
                </RowButton>
              );
            })}
          </OverflowMenu>
        </ListItemSecondaryAction>
      )}
    </ListItem>
  );
};
