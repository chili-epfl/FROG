// @flow
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List, Grid, Typography, Paper } from '@material-ui/core';
import { Bookmark } from '@material-ui/icons';
import { SessionListT } from '/imports/ui/Types/types';
import { ContentListItem } from '/imports/ui/ListItem';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'left',
    color: theme.palette.text.primary
  }
}));

type SessionsPagePropsT = {
  sessionsList: SessionListT
};

export const SessionsPage = ({ sessionsList }: SessionsPagePropsT) => {
  const classes = useStyles();
  return (
    <Grid container>
      <Grid item xs={12}>
        <Paper className={classes.paper} elevation={0}>
          <Typography variant="h5" align="left">
            <Bookmark /> Sessions
          </Typography>

          <List>
            {sessionsList.map(
              (
                {
                  itemIcon,
                  itemTitle,
                  itemType,
                  status,
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
                  status={status}
                  itemType={itemType}
                  dateCreated={dateCreated}
                  callback={callback}
                  secondaryActions={secondaryActions}
                />
              )
            )}
          </List>
        </Paper>
      </Grid>
    </Grid>
  );
};
