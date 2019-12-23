// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { Bookmark, AccountBox, Description } from '@material-ui/icons';
import { ContentListItem } from '/imports/ui/ListItem';
import {
  parseDraftData,
  parseSessionData
} from '/imports/client/UserDashboard/data-utils/helpers';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  },
  buttonRows: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    color: theme.palette.secondary.main
  }
}));

export const AdminsPage = ({ history }: { history: Object }) => {
  const classes = useStyles();

  const parseDate = (date): Date => {
    return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${date.getDate()}/${date.getMonth() +
      1}/${date.getFullYear()}`;
  };

  const parseEmail = user => {
    try {
      return user.emails[0].address;
    } catch {
      return 'Email Unavailable';
    }
  };

  const parseUsersList = (userList, history) => {
    return userList.map(item => {
      return {
        itemIcon: AccountBox,
        itemTitle: item.nameReference,
        itemType: parseEmail(item),
        dateCreated: parseDate(item.createdAt),
        dateObj: item.createdAt,
        callback: () => {}
      };
    });
  };

  const parseSessionsList = (sessionList, history) => {
    return parseSessionData(sessionList, history).map((item, index) => {
      return {
        ...item,
        itemType: `${item.itemType} | Owner: ${sessionList[index].ownerName}`,
        callback: () => {},
        secondaryActions: null
      };
    });
  };

  const parseGraphsList = (graphList, history) => {
    return parseDraftData(graphList, history).map((item, index) => {
      return {
        ...item,
        itemType: `Owner: ${graphList[index].ownerName}`,
        callback: () => {},
        secondaryActions: null
      };
    });
  };

  const [usersList, setUsersList] = React.useState([]);
  const [sessionsList, setSessionsList] = React.useState([]);
  const [graphsList, setGraphsList] = React.useState([]);

  React.useEffect(() => {
    // Newly Added Users
    Meteor.call('admin.users.all', (err, res) => {
      if (err) {
        console.info(err);
      }
      setUsersList(parseUsersList(res, history));
    });
    // Newly Created Sessions
    Meteor.call('admin.recentSessions', (err, res) => {
      if (err) {
        console.info(err);
      }
      setSessionsList(parseSessionsList(res, history));
    });
    // Newly Created Graphs
    Meteor.call('admin.recentGraphs', (err, res) => {
      if (err) {
        console.info(err);
      }
      setGraphsList(parseGraphsList(res, history));
    });
  }, []);

  return (
    <Grid container>
      {usersList.length > 0 && (
        <Grid
          item
          xs={sessionsList.length > 0 || graphsList.length > 0 ? 6 : 12}
        >
          <Paper className={classes.paper} elevation={0}>
            <div className={classes.buttonRows}>
              <Typography variant="h5" align="left">
                <AccountBox className={classes.icon} /> Recently Added Users
              </Typography>
            </div>

            <List dense>
              {usersList.slice(0, 6).map((props, index) => {
                return <ContentListItem key={index} {...props} />;
              })}
            </List>
          </Paper>
        </Grid>
      )}
      {sessionsList.length > 0 && (
        <Grid item xs={usersList.length > 0 || graphsList.length > 0 ? 6 : 12}>
          <Paper className={classes.paper} elevation={0}>
            <Typography variant="h5">
              <Bookmark className={classes.icon} /> Recently Created Sessions
            </Typography>

            <List dense>
              {sessionsList
                .slice(0, 6)
                .map(
                  (
                    {
                      itemIcon,
                      itemTitle,
                      status,
                      itemType,
                      dateCreated,
                      callback,
                      secondaryActions
                    },
                    index
                  ) => (
                    <ContentListItem
                      key={index}
                      itemIcon={itemIcon}
                      itemTitle={itemTitle}
                      itemType={itemType}
                      dateCreated={dateCreated}
                      status={status}
                      callback={callback}
                      secondaryActions={secondaryActions}
                    />
                  )
                )}
            </List>
          </Paper>
        </Grid>
      )}
      {graphsList.length > 0 && (
        <Grid
          item
          xs={sessionsList.length > 0 || usersList.length > 0 ? 6 : 12}
        >
          <Paper className={classes.paper} elevation={0}>
            <div className={classes.buttonRows}>
              <Typography variant="h5" align="left">
                <Description className={classes.icon} /> Recently Created Graphs
              </Typography>
            </div>

            <List dense>
              {graphsList.slice(0, 6).map((props, index) => {
                return <ContentListItem key={index} {...props} />;
              })}
            </List>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};
