// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Meteor } from 'meteor/meteor';
import { List, Grid, Typography, Paper, Tabs, Tab } from '@material-ui/core';
import { Bookmark, AccountBox, Description } from '@material-ui/icons';
import { ContentListItem } from '/imports/ui/ListItem';
import {
  parseDraftData,
  parseSessionData
} from '/imports/client/UserDashboard/data-utils/helpers';

const useStyles = makeStyles(theme => ({
  tabbar: {
    padding: theme.spacing(0),
    borderBottom: '1px solid #EAEAEA'
  },
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

  const parseDate = (date): string => {
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

  const impersonationCallback = (id, path = '') => {
    Meteor.call('impersonation.token', id, (err, res) => {
      if (err) {
        console.info(err);
      } else {
        history.push(`${path}/?u=${id}&token=${res}`);
        window.location.reload();
      }
    });
  };

  const parseUsersList = userList => {
    return userList.map((item, index) => {
      return {
        itemIcon: AccountBox,
        itemTitle: item.nameReference,
        itemType: parseEmail(item),
        dateCreated: parseDate(item.createdAt),
        dateObj: item.createdAt,
        callback: () => {
          impersonationCallback(userList[index]._id);
        }
      };
    });
  };

  const parseSessionsList = sessionList => {
    return parseSessionData(sessionList, history).map((item, index) => {
      return {
        ...item,
        itemType: `${item.itemType} | Owner: ${sessionList[index].ownerName}`,
        callback: () => {
          impersonationCallback(
            sessionList[index].ownerId,
            `/t/${sessionList[index].slug}`
          );
        },
        secondaryActions: null
      };
    });
  };

  const parseGraphsList = graphList => {
    return parseDraftData(graphList, history).map((item, index) => {
      return {
        ...item,
        itemType: `Owner: ${graphList[index].ownerName}`,
        callback: () => {
          impersonationCallback(
            graphList[index].ownerId,
            `/teacher/graph/${graphList[index]._id}`
          );
        },
        secondaryActions: null
      };
    });
  };

  const [usersList, setUsersList] = React.useState([]);
  const [sessionsList, setSessionsList] = React.useState([]);
  const [graphsList, setGraphsList] = React.useState([]);
  const [tab, setTab] = React.useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  React.useEffect(() => {
    // Newly Added Users
    Meteor.call('admin.users.all', (err, res) => {
      if (err) {
        console.info(err);
      }
      setUsersList(parseUsersList(res));
    });
    // Newly Created Sessions
    Meteor.call('admin.recentSessions', (err, res) => {
      if (err) {
        console.info(err);
      }
      setSessionsList(parseSessionsList(res));
    });
    // Newly Created Graphs
    Meteor.call('admin.recentGraphs', (err, res) => {
      if (err) {
        console.info(err);
      }
      setGraphsList(parseGraphsList(res));
    });
  }, []);

  return (
    <>
      <Paper className={classes.tabbar} elevation={0}>
        <Tabs
          value={tab}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label={<Typography>Users</Typography>} />
          <Tab label={<Typography>Sessions</Typography>} />
          <Tab label={<Typography>Graphs</Typography>} />
        </Tabs>
      </Paper>
      <Grid container>
        {tab === 0 && usersList.length > 0 && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <div className={classes.buttonRows}>
                <Typography variant="h5" align="left">
                  <AccountBox className={classes.icon} /> Recently Added Users
                </Typography>
              </div>

              <List dense>
                {usersList.map((props, index) => {
                  return <ContentListItem key={index} {...props} />;
                })}
              </List>
            </Paper>
          </Grid>
        )}
        {tab === 1 && sessionsList.length > 0 && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <Typography variant="h5">
                <Bookmark className={classes.icon} /> Recently Created Sessions
              </Typography>

              <List dense>
                {sessionsList.map(
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
        {tab === 2 && graphsList.length > 0 && (
          <Grid item xs={12}>
            <Paper className={classes.paper} elevation={0}>
              <div className={classes.buttonRows}>
                <Typography variant="h5" align="left">
                  <Description className={classes.icon} /> Recently Created
                  Graphs
                </Typography>
              </div>

              <List dense>
                {graphsList.map((props, index) => {
                  return <ContentListItem key={index} {...props} />;
                })}
              </List>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};
