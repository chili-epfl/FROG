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

  const DateToMoments = dateThen => {
    dateThenParse = dateThen.split('/');
    dateNow = new Date().toLocaleDateString();
    dateNowParse = dateNow.split('/');
    diffYear = parseInt(dateNowParse[2]) - parseInt(dateThenParse[2]);
    diffMonth = parseInt(dateNowParse[1]) - parseInt(dateThenParse[1]);
    diffDate = parseInt(dateNowParse[0]) - parseInt(dateThenParse[0]);
    if (diffYear > 0) {
      return `${diffYear} year${diffYear > 1 ? 's' : ''} ago`;
    } else if (diffMonth > 0) {
      return `${diffMonth} month${diffMonth > 1 ? 's' : ''} ago`;
    } else if (diffDate > 0) {
      return `${diffDate} day${diffDate > 1 ? 's' : ''} ago`;
    } else {
      return `Today`;
    }
  };

  return (
    <ListItem alignItems="flex-start" divider button onClick={callback}>
      <ListItemIcon>
        <Icon />
      </ListItemIcon>

      <ListItemText primary={itemTitle} secondary={secondaryText} divider />

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
                <RowButton key={index} icon={<ListIcon />}>
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
