// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { Bookmark, ShowChart, MoreHoriz, Add } from '@material-ui/icons';
import { SessionListT, DraftsListT } from '/imports/ui/Types/types';
import { ContentListItem } from '/imports/ui/ListItem';
import { Button } from '/imports/ui/Button';

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
  }
}));

type RecentsPagePropsT = {
  sessionsList: SessionListT,
  draftsList: DraftsListT,
  actionCallback: () => void,
  moreCallbackSessions: () => void,
  moreCallbackDrafts: () => void
};

export const RecentsPage = ({
  sessionsList,
  draftsList,
  actionCallback,
  moreCallbackDrafts, 
  moreCallbackSessions
}: RecentsPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={6}>
        <Paper className={classes.paper} elevation={0}>
          <div className={classes.buttonRows}>
            <Typography variant="h5" align="left">
              <ShowChart /> Drafts
            </Typography>
            <Button icon={<Add />} onClick={actionCallback} variant="primary">
              Create a new graph
            </Button>
          </div>

          <List>
            {draftsList.map(
              (
                {
                  itemIcon,
                  itemTitle,
                  itemType,
                  dateCreated,
                  callback,
                  secondaryActions
                },
                index
              ) => (
                <ContentListItem
                  key={index}
                  itemTitle={itemTitle}
                  itemIcon={itemIcon}
                  itemType={itemType}
                  dateCreated={dateCreated}
                  callback={callback}
                  secondaryActions={secondaryActions}
                />
              )
            )}
          </List>
          <div className={classes.buttonRows}>
            <Button onClick = {moreCallbackDrafts} icon={<MoreHoriz />} variant="minimal">
              More
            </Button>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={6}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h5">
            <Bookmark /> Sessions
          </Typography>

          <List>
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
          <Button onClick = {moreCallbackSessions}  icon={<MoreHoriz />} variant="minimal">
            More
          </Button>
        </Paper>
      </Grid>
    </Grid>
  );
};
